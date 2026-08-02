"use server";

import * as XLSX from "xlsx";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export type ImportarDatasetResult = {
  error: string | null;
  empresa: boolean;
  clientes: number;
  productos: number;
  cotizaciones: number;
  items: number;
};

const HOJAS_ESPERADAS = [
  "01_Empresa",
  "02_Clientes",
  "03_Productos",
  "04_Cotizaciones",
  "05_Items",
] as const;

// Encabezados esperados por hoja, usados para detectar en qué fila empiezan
// los datos reales (saltando las filas de título que trae el dataset).
// "id_temp" / "nombre" / "campo" cubren la mayoría de las hojas, pero
// 05_Items no tiene una columna "id_temp" propia, así que cada hoja declara
// sus propios marcadores.
const MARCADORES_EMPRESA = ["campo", "valor", "nombre", "nit", "direccion", "telefono"];
const MARCADORES_CLIENTES = ["id_temp", "nombre", "nit", "email", "telefono", "direccion"];
const MARCADORES_PRODUCTOS = ["id_temp", "nombre", "descripcion", "precio", "lleva_iva"];
const MARCADORES_COTIZACIONES = ["id_temp", "numero", "fecha", "cliente_id_temp", "subtotal"];
const MARCADORES_ITEMS = [
  "cotizacion_id_temp",
  "producto_id_temp",
  "cantidad",
  "precio_unitario",
  "descuento",
];

function conteosVacios(): Pick<
  ImportarDatasetResult,
  "clientes" | "productos" | "cotizaciones" | "items"
> {
  return { clientes: 0, productos: 0, cotizaciones: 0, items: 0 };
}

function texto(valor: unknown): string | null {
  if (valor === null || valor === undefined) return null;
  const limpio = String(valor).trim();
  return limpio.length > 0 ? limpio : null;
}

function idTemp(valor: unknown): string | null {
  return texto(valor);
}

function numero(valor: unknown): number {
  if (typeof valor === "number") return Number.isFinite(valor) ? valor : 0;
  if (typeof valor === "string") {
    const limpio = valor.trim().replace(/,/g, "");
    const n = Number(limpio);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function booleano(valor: unknown): boolean {
  if (typeof valor === "boolean") return valor;
  if (typeof valor === "number") return valor !== 0;
  if (typeof valor === "string") {
    const limpio = valor.trim().toLowerCase();
    return ["si", "sí", "true", "1", "x", "yes"].includes(limpio);
  }
  return false;
}

function fechaISO(valor: unknown): string {
  if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
    return valor.toISOString().slice(0, 10);
  }
  if (typeof valor === "number") {
    const fecha = XLSX.SSF.parse_date_code(valor);
    if (fecha) {
      const mm = String(fecha.m).padStart(2, "0");
      const dd = String(fecha.d).padStart(2, "0");
      return `${fecha.y}-${mm}-${dd}`;
    }
  }
  if (typeof valor === "string") {
    const limpio = valor.trim();
    const coincidenciaISO = limpio.match(/^\d{4}-\d{2}-\d{2}/);
    if (coincidenciaISO) return coincidenciaISO[0];
    const parseado = new Date(limpio);
    if (!Number.isNaN(parseado.getTime())) {
      return parseado.toISOString().slice(0, 10);
    }
  }
  return new Date().toISOString().slice(0, 10);
}

function encontrarFilaEncabezado(filas: unknown[][], marcadores: string[]): number {
  return filas.findIndex((fila) =>
    fila.some(
      (celda) =>
        typeof celda === "string" && marcadores.includes(celda.trim().toLowerCase())
    )
  );
}

/**
 * Convierte una hoja en objetos usando la fila de encabezados real
 * (saltando las filas de título que el dataset agrega antes de los datos).
 */
function filasComoObjetos(
  sheet: XLSX.WorkSheet,
  marcadores: string[]
): Record<string, unknown>[] {
  const filas = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: null,
    blankrows: false,
  });

  const idxEncabezado = encontrarFilaEncabezado(filas, marcadores);
  if (idxEncabezado === -1) return [];

  const encabezados = filas[idxEncabezado].map((celda) =>
    typeof celda === "string" ? celda.trim().toLowerCase() : celda
  );

  return filas
    .slice(idxEncabezado + 1)
    .map((fila) => {
      const registro: Record<string, unknown> = {};
      encabezados.forEach((clave, i) => {
        if (typeof clave === "string" && clave.length > 0) {
          registro[clave] = fila[i] ?? null;
        }
      });
      return registro;
    })
    .filter((registro) =>
      Object.values(registro).some((valor) => valor !== null && valor !== "")
    );
}

type DatosEmpresa = {
  nombre: string | null;
  nit: string | null;
  direccion: string | null;
  telefono: string | null;
};

/**
 * La hoja 01_Empresa puede venir como una sola fila con columnas
 * nombre/nit/direccion/telefono, o como pares Campo/Valor. Soportamos ambas.
 */
function extraerEmpresa(sheet: XLSX.WorkSheet): DatosEmpresa | null {
  const filas = filasComoObjetos(sheet, MARCADORES_EMPRESA);
  if (filas.length === 0) return null;

  if ("campo" in filas[0] && "valor" in filas[0]) {
    const mapa = new Map<string, unknown>();
    for (const fila of filas) {
      const campo = texto(fila.campo)?.toLowerCase();
      if (campo) mapa.set(campo, fila.valor);
    }
    return {
      nombre: texto(mapa.get("nombre")),
      nit: texto(mapa.get("nit")),
      direccion: texto(mapa.get("direccion")),
      telefono: texto(mapa.get("telefono")),
    };
  }

  const fila = filas[0];
  return {
    nombre: texto(fila.nombre),
    nit: texto(fila.nit),
    direccion: texto(fila.direccion),
    telefono: texto(fila.telefono),
  };
}

export async function importarDatasetExcel(
  formData: FormData
): Promise<ImportarDatasetResult> {
  const archivo = formData.get("archivo");

  if (!(archivo instanceof Blob) || archivo.size === 0) {
    return {
      error: "Selecciona un archivo Excel (.xlsx) para importar.",
      empresa: false,
      ...conteosVacios(),
    };
  }

  let workbook: XLSX.WorkBook;
  try {
    const buffer = Buffer.from(await archivo.arrayBuffer());
    workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
  } catch {
    return {
      error:
        "No se pudo leer el archivo. Verifica que sea un Excel válido (.xlsx).",
      empresa: false,
      ...conteosVacios(),
    };
  }

  const hojasFaltantes = HOJAS_ESPERADAS.filter(
    (hoja) => !workbook.SheetNames.includes(hoja)
  );
  if (hojasFaltantes.length > 0) {
    return {
      error: `El archivo no tiene las hojas esperadas: ${hojasFaltantes.join(", ")}.`,
      empresa: false,
      ...conteosVacios(),
    };
  }

  const datosEmpresa = extraerEmpresa(workbook.Sheets["01_Empresa"]);
  if (!datosEmpresa?.nombre) {
    return {
      error: "La hoja 01_Empresa no tiene un nombre de empresa válido.",
      empresa: false,
      ...conteosVacios(),
    };
  }

  const filasClientes = filasComoObjetos(
    workbook.Sheets["02_Clientes"],
    MARCADORES_CLIENTES
  );
  const filasProductos = filasComoObjetos(
    workbook.Sheets["03_Productos"],
    MARCADORES_PRODUCTOS
  );
  const filasCotizaciones = filasComoObjetos(
    workbook.Sheets["04_Cotizaciones"],
    MARCADORES_COTIZACIONES
  );
  const filasItems = filasComoObjetos(workbook.Sheets["05_Items"], MARCADORES_ITEMS);

  if (
    filasClientes.length === 0 ||
    filasProductos.length === 0 ||
    filasCotizaciones.length === 0
  ) {
    return {
      error:
        "No se encontraron filas de datos en 02_Clientes, 03_Productos o 04_Cotizaciones.",
      empresa: false,
      ...conteosVacios(),
    };
  }

  // a. Borrar datos existentes en orden estricto (empresas solo se actualiza).
  const { error: errorBorrarItems } = await supabase
    .from("cotizacion_items")
    .delete()
    .not("id", "is", null);
  if (errorBorrarItems) {
    return {
      error: `No se pudieron borrar los ítems anteriores: ${errorBorrarItems.message}`,
      empresa: false,
      ...conteosVacios(),
    };
  }

  const { error: errorBorrarCotizaciones } = await supabase
    .from("cotizaciones")
    .delete()
    .not("id", "is", null);
  if (errorBorrarCotizaciones) {
    return {
      error: `No se pudieron borrar las cotizaciones anteriores: ${errorBorrarCotizaciones.message}`,
      empresa: false,
      ...conteosVacios(),
    };
  }

  const { error: errorBorrarClientes } = await supabase
    .from("clientes")
    .delete()
    .not("id", "is", null);
  if (errorBorrarClientes) {
    return {
      error: `No se pudieron borrar los clientes anteriores: ${errorBorrarClientes.message}`,
      empresa: false,
      ...conteosVacios(),
    };
  }

  const { error: errorBorrarProductos } = await supabase
    .from("productos")
    .delete()
    .not("id", "is", null);
  if (errorBorrarProductos) {
    return {
      error: `No se pudieron borrar los productos anteriores: ${errorBorrarProductos.message}`,
      empresa: false,
      ...conteosVacios(),
    };
  }

  // b. Insertar/actualizar empresa.
  const payloadEmpresa = {
    nombre: datosEmpresa.nombre,
    nit: datosEmpresa.nit,
    direccion: datosEmpresa.direccion,
    telefono: datosEmpresa.telefono,
  };

  const { data: empresasExistentes } = await supabase
    .from("empresas")
    .select("id")
    .limit(1);

  if (empresasExistentes && empresasExistentes.length > 0) {
    const { error } = await supabase
      .from("empresas")
      .update(payloadEmpresa)
      .eq("id", empresasExistentes[0].id);
    if (error) {
      return {
        error: `No se pudo actualizar la empresa: ${error.message}`,
        empresa: false,
        ...conteosVacios(),
      };
    }
  } else {
    const { error } = await supabase
      .from("empresas")
      .insert({ ...payloadEmpresa, logo_url: null });
    if (error) {
      return {
        error: `No se pudo guardar la empresa: ${error.message}`,
        empresa: false,
        ...conteosVacios(),
      };
    }
  }

  const conteos = conteosVacios();

  // c. Insertar clientes -> Map<id_temp, uuid real>.
  const mapaClientes = new Map<string, string>();
  for (const fila of filasClientes) {
    const nombre = texto(fila.nombre);
    if (!nombre) continue;

    const { data, error } = await supabase
      .from("clientes")
      .insert({
        nombre,
        nit: texto(fila.nit),
        email: texto(fila.email),
        telefono: texto(fila.telefono),
        direccion: texto(fila.direccion),
      })
      .select("id")
      .single();

    if (error || !data) {
      return {
        error: `Se cargó la empresa y ${conteos.clientes} cliente(s), pero falló al guardar un cliente: ${error?.message ?? "error desconocido"}`,
        empresa: true,
        ...conteos,
      };
    }

    conteos.clientes += 1;
    const clave = idTemp(fila.id_temp);
    if (clave) mapaClientes.set(clave, data.id);
  }

  // d. Insertar productos -> Map<id_temp, uuid real>.
  const mapaProductos = new Map<string, string>();
  for (const fila of filasProductos) {
    const nombre = texto(fila.nombre);
    if (!nombre) continue;

    const { data, error } = await supabase
      .from("productos")
      .insert({
        nombre,
        descripcion: texto(fila.descripcion),
        precio: numero(fila.precio),
        lleva_iva: booleano(fila.lleva_iva),
      })
      .select("id")
      .single();

    if (error || !data) {
      return {
        error: `Se cargaron ${conteos.clientes} cliente(s) y ${conteos.productos} producto(s), pero falló al guardar un producto: ${error?.message ?? "error desconocido"}`,
        empresa: true,
        ...conteos,
      };
    }

    conteos.productos += 1;
    const clave = idTemp(fila.id_temp);
    if (clave) mapaProductos.set(clave, data.id);
  }

  // e. Insertar cotizaciones usando el Map de clientes -> Map de cotizaciones.
  const mapaCotizaciones = new Map<string, string>();
  for (const fila of filasCotizaciones) {
    const numeroCotizacion = texto(fila.numero);
    const clienteIdTemp = idTemp(fila.cliente_id_temp);
    const clienteId = clienteIdTemp ? mapaClientes.get(clienteIdTemp) : undefined;

    if (!numeroCotizacion || !clienteId) {
      return {
        error: `La cotización "${numeroCotizacion ?? texto(fila.id_temp) ?? "?"}" hace referencia a un cliente (cliente_id_temp="${clienteIdTemp ?? ""}") que no existe entre los clientes importados.`,
        empresa: true,
        ...conteos,
      };
    }

    const { data, error } = await supabase
      .from("cotizaciones")
      .insert({
        cliente_id: clienteId,
        numero: numeroCotizacion,
        fecha: fechaISO(fila.fecha),
        subtotal: numero(fila.subtotal),
        iva: numero(fila.iva),
        total: numero(fila.total),
        observaciones: texto(fila.observaciones),
      })
      .select("id")
      .single();

    if (error || !data) {
      return {
        error: `Se cargaron ${conteos.clientes} cliente(s), ${conteos.productos} producto(s) y ${conteos.cotizaciones} cotización(es), pero falló al guardar una cotización: ${error?.message ?? "error desconocido"}`,
        empresa: true,
        ...conteos,
      };
    }

    conteos.cotizaciones += 1;
    const clave = idTemp(fila.id_temp);
    if (clave) mapaCotizaciones.set(clave, data.id);
  }

  // f. Insertar cotizacion_items usando ambos Maps.
  const itemsParaInsertar: {
    cotizacion_id: string;
    producto_id: string | null;
    cantidad: number;
    precio_unitario: number;
    descuento: number;
    subtotal: number;
  }[] = [];

  for (const fila of filasItems) {
    const cotizacionIdTemp = idTemp(fila.cotizacion_id_temp);
    const cotizacionId = cotizacionIdTemp
      ? mapaCotizaciones.get(cotizacionIdTemp)
      : undefined;

    if (!cotizacionId) {
      return {
        error: `Un ítem hace referencia a una cotización (cotizacion_id_temp="${cotizacionIdTemp ?? ""}") que no existe entre las cotizaciones importadas.`,
        empresa: true,
        ...conteos,
      };
    }

    const productoIdTemp = idTemp(fila.producto_id_temp);
    const productoId = productoIdTemp
      ? (mapaProductos.get(productoIdTemp) ?? null)
      : null;

    itemsParaInsertar.push({
      cotizacion_id: cotizacionId,
      producto_id: productoId,
      cantidad: numero(fila.cantidad),
      precio_unitario: numero(fila.precio_unitario),
      descuento: numero(fila.descuento),
      subtotal: numero(fila.subtotal),
    });
  }

  if (itemsParaInsertar.length > 0) {
    const { error } = await supabase
      .from("cotizacion_items")
      .insert(itemsParaInsertar);

    if (error) {
      return {
        error: `Se cargaron ${conteos.clientes} cliente(s), ${conteos.productos} producto(s) y ${conteos.cotizaciones} cotización(es), pero fallaron los ítems: ${error.message}`,
        empresa: true,
        ...conteos,
      };
    }

    conteos.items = itemsParaInsertar.length;
  }

  // g. Revalidar las páginas que muestran estos datos.
  revalidatePath("/");
  revalidatePath("/clientes");
  revalidatePath("/productos");
  revalidatePath("/empresa");
  revalidatePath("/cotizaciones/nueva");

  return { error: null, empresa: true, ...conteos };
}
