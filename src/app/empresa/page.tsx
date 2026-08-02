import { supabase } from "@/lib/supabase";
import { EmpresaForm } from "./empresa-form";
import { ImportDatasetForm } from "./import-dataset-form";

export default async function EmpresaPage() {
  const { data } = await supabase.from("empresas").select("*").limit(1);
  const empresa = data?.[0] ?? null;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Configuración de empresa
        </h1>
        <p className="text-sm text-muted-foreground">
          Estos datos aparecerán en el encabezado del PDF de tus cotizaciones.
        </p>
      </div>

      <EmpresaForm empresa={empresa} />
      <ImportDatasetForm />
    </div>
  );
}
