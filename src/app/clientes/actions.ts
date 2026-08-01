"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export type CrearClienteResult = {
  error: string | null;
};

function campoOpcional(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const limpio = value.trim();
  return limpio.length > 0 ? limpio : null;
}

export async function crearCliente(
  formData: FormData
): Promise<CrearClienteResult> {
  const nombre = campoOpcional(formData.get("nombre"));

  if (!nombre) {
    return { error: "El nombre es obligatorio." };
  }

  const { error } = await supabase.from("clientes").insert({
    nombre,
    nit: campoOpcional(formData.get("nit")),
    email: campoOpcional(formData.get("email")),
    telefono: campoOpcional(formData.get("telefono")),
    direccion: campoOpcional(formData.get("direccion")),
  });

  if (error) {
    return {
      error: "No se pudo guardar el cliente. Intenta de nuevo.",
    };
  }

  revalidatePath("/clientes");
  return { error: null };
}
