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
      <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 px-6 py-7 text-primary-foreground shadow-lg sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-primary-foreground/70">
              Forja Rayo
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Cotizaciones
            </h1>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Historial de cotizaciones generadas · {cotizaciones.length} registro
              {cotizaciones.length === 1 ? "" : "s"}
            </p>
          </div>
          <Button
            render={<Link href="/cotizaciones/nueva" />}
            className="w-full bg-white text-primary hover:bg-white/90 sm:w-auto"
          >
            + Nueva cotización
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden shadow-sm">
        <CardContent className="p-0 sm:p-0">
          {error ? (
            <p className="py-12 text-center text-sm text-destructive">
              No se pudo cargar el historial. Verifica la conexión con Supabase.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="pl-6">Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="pr-6 text-right">PDF</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cotizaciones.length > 0 ? (
                  cotizaciones.map((cot) => (
                    <TableRow key={cot.id} className="hover:bg-muted/30">
                      <TableCell className="pl-6 font-semibold text-primary">
                        {cot.numero}
                      </TableCell>
                      <TableCell>{cot.clientes?.nombre ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {cot.fecha
                          ? new Date(cot.fecha + "T12:00:00").toLocaleDateString(
                              "es-CO"
                            )
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right font-medium whitespace-nowrap">
                        {formatoPrecio.format(Number(cot.total) || 0)}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          render={
                            <a
                              href={`/cotizaciones/${cot.id}/pdf`}
                              target="_blank"
                              rel="noopener noreferrer"
                            />
                          }
                        >
                          Ver PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-16 text-center text-sm text-muted-foreground"
                    >
                      No hay cotizaciones aún. Crea la primera con el botón de
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
