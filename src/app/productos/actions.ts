"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export type CrearProductoResult = {
  error: string | null;
};

function campoOpcional(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const limpio = value.trim();
  return limpio.length > 0 ? limpio : null;
}

export async function crearProducto(
  formData: FormData
): Promise<CrearProductoResult> {
  const nombre = campoOpcional(formData.get("nombre"));
  const precioRaw = formData.get("precio");
  const precio = typeof precioRaw === "string" ? Number(precioRaw) : NaN;

  if (!nombre) {
    return { error: "El nombre es obligatorio." };
  }

  if (Number.isNaN(precio) || precio < 0) {
    return { error: "El precio es obligatorio y debe ser un número válido." };
  }

  const { error } = await supabase.from("productos").insert({
    nombre,
    descripcion: campoOpcional(formData.get("descripcion")),
    precio,
    lleva_iva: formData.get("lleva_iva") !== null,
  });

  if (error) {
    return {
      error: "No se pudo guardar el producto. Intenta de nuevo.",
    };
  }

  revalidatePath("/productos");
  return { error: null };
}
