import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { NuevoClienteDialog } from "./nuevo-cliente-dialog";

export default async function ClientesPage() {
  const { data: clientes, error } = await supabase
    .from("clientes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {clientes?.length ?? 0} cliente
            {(clientes?.length ?? 0) === 1 ? "" : "s"} registrados
          </p>
        </div>
        <NuevoClienteDialog />
      </div>

      <Card className="overflow-hidden shadow-sm">
        <CardContent className="p-0">
          {error ? (
            <p className="py-12 text-center text-sm text-destructive">
              No se pudo cargar la lista de clientes. Verifica la conexión con
              Supabase.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="pl-6">Nombre</TableHead>
                  <TableHead>NIT</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="pr-6">Teléfono</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes && clientes.length > 0 ? (
                  clientes.map((cliente) => (
                    <TableRow key={cliente.id} className="hover:bg-muted/30">
                      <TableCell className="pl-6 font-medium">
                        {cliente.nombre}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {cliente.nit ?? "—"}
                      </TableCell>
                      <TableCell>{cliente.email ?? "—"}</TableCell>
                      <TableCell className="pr-6">
                        {cliente.telefono ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-16 text-center text-sm text-muted-foreground"
                    >
                      No hay clientes aún. Agrega el primero con el botón de
                      arriba.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
