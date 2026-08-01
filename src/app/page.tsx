import Link from "next/link";
import { Button } from "@/components/ui/button";
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

const formatoPrecio = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

type CotizacionConCliente = {
  id: string;
  numero: string;
  fecha: string;
  total: number;
  clientes: { nombre: string } | null;
};

export default async function CotizacionesPage() {
  const { data, error } = await supabase
    .from("cotizaciones")
    .select("id, numero, fecha, total, clientes(nombre)")
    .order("created_at", { ascending: false });

  const cotizaciones = (data ?? []) as unknown as CotizacionConCliente[];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Cotizaciones
          </h1>
          <p className="text-sm text-muted-foreground">
            Historial de cotizaciones generadas.
          </p>
        </div>
        <Button
          render={<Link href="/cotizaciones/nueva" />}
          className="w-full sm:w-auto"
        >
          Nueva cotización
        </Button>
      </div>

      <Card>
        <CardContent>
          {error ? (
            <p className="py-10 text-center text-sm text-destructive">
              No se pudo cargar el historial. Verifica la conexión con Supabase.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cotizaciones.length > 0 ? (
                  cotizaciones.map((cot) => (
                    <TableRow key={cot.id}>
                      <TableCell className="font-medium">{cot.numero}</TableCell>
                      <TableCell>
                        {cot.clientes?.nombre ?? "—"}
                      </TableCell>
                      <TableCell>
                        {cot.fecha
                          ? new Date(cot.fecha + "T12:00:00").toLocaleDateString(
                              "es-CO"
                            )
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {formatoPrecio.format(Number(cot.total) || 0)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-10 text-center text-sm whitespace-normal text-muted-foreground"
                    >
                      No hay cotizaciones aún.
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
