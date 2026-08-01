"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export type GuardarEmpresaResult = {
  error: string | null;
};

function campoOpcional(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const limpio = value.trim();
  return limpio.length > 0 ? limpio : null;
}

export async function guardarEmpresa(
  formData: FormData
): Promise<GuardarEmpresaResult> {
  const nombre = campoOpcional(formData.get("nombre"));

  if (!nombre) {
    return { error: "El nombre de la empresa es obligatorio." };
  }

  const payload = {
    nombre,
    nit: campoOpcional(formData.get("nit")),
    direccion: campoOpcional(formData.get("direccion")),
    telefono: campoOpcional(formData.get("telefono")),
  };

  const { data: existentes } = await supabase
    .from("empresas")
    .select("id")
    .limit(1);

  if (existentes && existentes.length > 0) {
    const { error } = await supabase
      .from("empresas")
      .update(payload)
      .eq("id", existentes[0].id);

    if (error) {
      return { error: `No se pudo actualizar: ${error.message}` };
    }
  } else {
    const { error } = await supabase.from("empresas").insert(payload);

    if (error) {
      return { error: `No se pudo guardar: ${error.message}` };
    }
  }

  revalidatePath("/empresa");
  return { error: null };
}
