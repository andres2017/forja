"use server";

import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Esta acción se invoca directamente desde un onClick (no desde un <form>),
// porque los datos ya viven en el estado del Client Component (cliente
// elegido, filas de ítems, totales calculados en vivo). Pasar un objeto plano
// serializable es más simple que armar un FormData con un array anidado de
// ítems. Ver node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md
// sección "Event Handlers": los Server Functions se pueden invocar como
// funciones async normales con cualquier argumento serializable, no solo
// desde formularios.
export type GuardarCotizacionItemPayload = {
  productoId: string | null;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  subtotal: number;
};

export type GuardarCotizacionPayload = {
  clienteId: string;
  subtotal: number;
  iva: number;
  total: number;
  observaciones: string | null;
  items: GuardarCotizacionItemPayload[];
};

export type GuardarCotizacionResult = {
  error: string | null;
};

export async function guardarCotizacion(
  payload: GuardarCotizacionPayload
): Promise<GuardarCotizacionResult> {
  if (!payload.clienteId) {
    return { error: "Selecciona un cliente." };
  }

  if (payload.items.length === 0) {
    return { error: "Agrega al menos un ítem." };
  }

  const anio = new Date().getFullYear();
  const prefijo = `COT-${anio}-`;

  const { count, error: errorConteo } = await supabase
    .from("cotizaciones")
    .select("id", { count: "exact", head: true })
    .like("numero", `${prefijo}%`);

  if (errorConteo) {
    return {
      error: "No se pudo generar el número de cotización. Intenta de nuevo.",
    };
  }

  const numero = `${prefijo}${String((count ?? 0) + 1).padStart(4, "0")}`;

  const { data: cotizacion, error: errorCotizacion } = await supabase
    .from("cotizaciones")
    .insert({
      cliente_id: payload.clienteId,
      numero,
      fecha: new Date().toISOString().slice(0, 10),
      subtotal: payload.subtotal,
      iva: payload.iva,
      total: payload.total,
      observaciones: payload.observaciones,
    })
    .select("id")
    .single();

  if (errorCotizacion || !cotizacion) {
    return { error: "No se pudo guardar la cotización. Intenta de nuevo." };
  }

  const { error: errorItems } = await supabase.from("cotizacion_items").insert(
    payload.items.map((item) => ({
      cotizacion_id: cotizacion.id,
      producto_id: item.productoId,
      cantidad: item.cantidad,
      precio_unitario: item.precioUnitario,
      descuento: item.descuento,
      subtotal: item.subtotal,
    }))
  );

  if (errorItems) {
    return {
      error:
        "La cotización se creó pero hubo un error al guardar los ítems. Intenta de nuevo.",
    };
  }

  // redirect() lanza una excepción de control de flujo manejada por Next.js;
  // por eso va fuera de cualquier try/catch y como última línea (no hace
  // falta "return redirect(...)", ver node_modules/next/dist/docs/01-app/03-api-reference/04-functions/redirect.md).
  redirect("/");
}
