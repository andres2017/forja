"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { Cliente, Producto } from "@/types/database";
import { guardarCotizacion } from "./actions";

const formatoPrecio = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const TASA_IVA = 0.19;

// Evita arrastrar residuos de punto flotante (ej. 189999.99999999997) a los
// valores que se guardan en Supabase.
function redondear(valor: number) {
  return Math.round(valor * 100) / 100;
}

type ItemRow = {
  id: string;
  productoId: string | null;
  cantidad: string;
  descuento: string;
};

let siguienteId = 0;

function crearFila(): ItemRow {
  siguienteId += 1;
  return {
    id: `item-${siguienteId}`,
    productoId: null,
    cantidad: "1",
    descuento: "0",
  };
}

export function NuevaCotizacionForm({
  clientes,
  productos,
}: {
  clientes: Cliente[];
  productos: Producto[];
}) {
  const [clienteId, setClienteId] = useState<string | null>(null);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [observaciones, setObservaciones] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Select.Value (Base UI) solo puede mostrar el nombre del cliente/producto
  // en lugar del id crudo si el Select recibe este mapa id -> etiqueta.
  const clienteItems = Object.fromEntries(
    clientes.map((cliente) => [cliente.id, cliente.nombre])
  );
  const productoItems = Object.fromEntries(
    productos.map((producto) => [producto.id, producto.nombre])
  );

  function agregarItem() {
    setItems((prev) => [...prev, crearFila()]);
  }

  function actualizarItem(id: string, cambios: Partial<ItemRow>) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...cambios } : item))
    );
  }

  function calcularSubtotalFila(item: ItemRow) {
    const producto = productos.find((p) => p.id === item.productoId);
    const precio = producto?.precio ?? 0;
    const cantidad = Number(item.cantidad) || 0;
    const descuento = Number(item.descuento) || 0;
    return precio * cantidad - descuento;
  }

  // Derivados directamente de `items`/`productos` en cada render (nada de
  // estado aparte ni useMemo) para que se actualicen solos al cambiar
  // cualquier fila.
  const subtotalGeneral = items.reduce(
    (acumulado, item) => acumulado + calcularSubtotalFila(item),
    0
  );
  const iva = items.reduce((acumulado, item) => {
    const producto = productos.find((p) => p.id === item.productoId);
    if (!producto?.lleva_iva) return acumulado;
    return acumulado + calcularSubtotalFila(item) * TASA_IVA;
  }, 0);
  const total = subtotalGeneral + iva;

  const puedeGuardar = Boolean(clienteId) && items.length > 0;

  async function handleGuardar() {
    if (!clienteId || items.length === 0) return;

    setGuardando(true);
    setError(null);

    const resultado = await guardarCotizacion({
      clienteId,
      subtotal: redondear(subtotalGeneral),
      iva: redondear(iva),
      total: redondear(total),
      observaciones: observaciones.trim() || null,
      items: items.map((item) => {
        const producto = productos.find((p) => p.id === item.productoId);
        return {
          productoId: item.productoId,
          cantidad: Number(item.cantidad) || 0,
          precioUnitario: producto?.precio ?? 0,
          descuento: Number(item.descuento) || 0,
          subtotal: redondear(calcularSubtotalFila(item)),
        };
      }),
    });

    if (resultado.error) {
      setError(resultado.error);
      setGuardando(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cliente">Cliente</Label>
            <Select
              items={clienteItems}
              value={clienteId}
              onValueChange={setClienteId}
            >
              <SelectTrigger id="cliente" className="w-full">
                <SelectValue placeholder="Selecciona un cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes.length > 0 ? (
                  clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nombre}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="sin-clientes" disabled>
                    No hay clientes aún
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ítems</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Descuento</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length > 0 ? (
                items.map((item) => {
                  const producto = productos.find(
                    (p) => p.id === item.productoId
                  );
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="min-w-40">
                        <Select
                          items={productoItems}
                          value={item.productoId}
                          onValueChange={(value) =>
                            actualizarItem(item.id, { productoId: value })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona un producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {productos.length > 0 ? (
                              productos.map((producto) => (
                                <SelectItem key={producto.id} value={producto.id}>
                                  {producto.nombre}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="sin-productos" disabled>
                                No hay productos aún
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          value={item.cantidad}
                          onChange={(event) =>
                            actualizarItem(item.id, {
                              cantidad: event.target.value,
                            })
                          }
                          className="ml-auto w-20 text-right"
                        />
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {producto ? formatoPrecio.format(producto.precio) : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.descuento}
                          onChange={(event) =>
                            actualizarItem(item.id, {
                              descuento: event.target.value,
                            })
                          }
                          className="ml-auto w-24 text-right"
                        />
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {formatoPrecio.format(calcularSubtotalFila(item))}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-sm whitespace-normal text-muted-foreground"
                  >
                    Aún no has agregado ítems.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Button
            type="button"
            variant="outline"
            onClick={agregarItem}
            className="w-full sm:w-auto"
          >
            Agregar ítem
          </Button>
        </CardContent>
      </Card>

      <Card className="ml-auto w-full sm:w-80">
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatoPrecio.format(subtotalGeneral)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">IVA</span>
            <span>{formatoPrecio.format(iva)}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatoPrecio.format(total)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Observaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              name="observaciones"
              placeholder="Notas adicionales para el cliente..."
              rows={4}
              value={observaciones}
              onChange={(event) => setObservaciones(event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <p className="text-right text-sm text-destructive">{error}</p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          render={<Link href="/" />}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
        <Button
          disabled={!puedeGuardar || guardando}
          onClick={handleGuardar}
          className="w-full sm:w-auto"
        >
          {guardando ? "Guardando..." : "Guardar cotización"}
        </Button>
      </div>
    </>
  );
}
