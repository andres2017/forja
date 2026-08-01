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
          <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Datos de contacto de tus clientes.
          </p>
        </div>
        <NuevoClienteDialog />
      </div>

      <Card>
        <CardContent>
          {error ? (
            <p className="py-10 text-center text-sm whitespace-normal text-destructive">
              No se pudo cargar la lista de clientes. Verifica la conexión con
              Supabase.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes && clientes.length > 0 ? (
                  clientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell>{cliente.nombre}</TableCell>
                      <TableCell>{cliente.email ?? "—"}</TableCell>
                      <TableCell>{cliente.telefono ?? "—"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="py-10 text-center text-sm whitespace-normal text-muted-foreground"
                    >
                      No hay clientes aún.
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
