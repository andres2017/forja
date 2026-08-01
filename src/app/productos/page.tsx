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
import { NuevoProductoDialog } from "./nuevo-producto-dialog";

const formatoPrecio = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default async function ProductosPage() {
  const { data: productos, error } = await supabase
    .from("productos")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Productos
          </h1>
          <p className="text-sm text-muted-foreground">
            Productos y servicios que ofreces en tus cotizaciones.
          </p>
        </div>
        <NuevoProductoDialog />
      </div>

      <Card>
        <CardContent>
          {error ? (
            <p className="py-10 text-center text-sm whitespace-normal text-destructive">
              No se pudo cargar la lista de productos. Verifica la conexión
              con Supabase.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-right">IVA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productos && productos.length > 0 ? (
                  productos.map((producto) => (
                    <TableRow key={producto.id}>
                      <TableCell>{producto.nombre}</TableCell>
                      <TableCell className="text-right">
                        {formatoPrecio.format(producto.precio)}
                      </TableCell>
                      <TableCell className="text-right">
                        {producto.lleva_iva ? "Sí" : "No"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="py-10 text-center text-sm whitespace-normal text-muted-foreground"
                    >
                      No hay productos aún.
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
