"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

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

  const itemsValidos = payload.items.filter(
    (item) => item.productoId && item.cantidad > 0
  );

  if (itemsValidos.length === 0) {
    return {
      error: "Agrega al menos un ítem con producto y cantidad mayores a 0.",
    };
  }

  const anio = new Date().getFullYear();
  const prefijo = `COT-${anio}-`;

  const { count, error: errorConteo } = await supabase
    .from("cotizaciones")
    .select("id", { count: "exact", head: true })
    .like("numero", `${prefijo}%`);

  if (errorConteo) {
    return {
      error: `No se pudo generar el número de cotización: ${errorConteo.message}`,
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
    return {
      error: `No se pudo guardar la cotización: ${errorCotizacion?.message ?? "error desconocido"}`,
    };
  }

  const { error: errorItems } = await supabase.from("cotizacion_items").insert(
    itemsValidos.map((item) => ({
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
      error: `La cotización se creó pero fallaron los ítems: ${errorItems.message}`,
    };
  }

  revalidatePath("/");
  redirect("/");
}
