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
          <h1 className="text-2xl font-bold tracking-tight">Productos</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {productos?.length ?? 0} producto
            {(productos?.length ?? 0) === 1 ? "" : "s"} en el catálogo
          </p>
        </div>
        <NuevoProductoDialog />
      </div>

      <Card className="overflow-hidden shadow-sm">
        <CardContent className="p-0">
          {error ? (
            <p className="py-12 text-center text-sm text-destructive">
              No se pudo cargar la lista de productos. Verifica la conexión con
              Supabase.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="pl-6">Nombre</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="pr-6 text-center">IVA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productos && productos.length > 0 ? (
                  productos.map((producto) => (
                    <TableRow key={producto.id} className="hover:bg-muted/30">
                      <TableCell className="pl-6">
                        <div className="font-medium">{producto.nombre}</div>
                        {producto.descripcion ? (
                          <div className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                            {producto.descripcion}
                          </div>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-right font-medium whitespace-nowrap">
                        {formatoPrecio.format(Number(producto.precio) || 0)}
                      </TableCell>
                      <TableCell className="pr-6 text-center">
                        <span
                          className={
                            producto.lleva_iva
                              ? "inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                              : "inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                          }
                        >
                          {producto.lleva_iva ? "19%" : "No"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="py-16 text-center text-sm text-muted-foreground"
                    >
                      No hay productos aún. Agrega el primero con el botón de
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
