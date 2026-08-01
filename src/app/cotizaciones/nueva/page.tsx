import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { NuevaCotizacionForm } from "./nueva-cotizacion-form";

export default async function NuevaCotizacionPage() {
  const [
    { data: clientes, error: errorClientes },
    { data: productos, error: errorProductos },
  ] = await Promise.all([
    supabase.from("clientes").select("*").order("created_at", { ascending: false }),
    supabase.from("productos").select("*").order("created_at", { ascending: false }),
  ]);

  const error = errorClientes || errorProductos;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Nueva cotización
        </h1>
        <p className="text-sm text-muted-foreground">
          Selecciona un cliente, agrega los ítems y revisa los totales.
        </p>
      </div>

      {error ? (
        <Card>
          <CardContent>
            <p className="py-10 text-center text-sm whitespace-normal text-destructive">
              No se pudieron cargar los clientes o productos. Verifica la
              conexión con Supabase.
            </p>
          </CardContent>
        </Card>
      ) : (
        <NuevaCotizacionForm
          clientes={clientes ?? []}
          productos={productos ?? []}
        />
      )}
    </div>
  );
}
