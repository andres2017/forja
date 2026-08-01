import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { supabase } from "@/lib/supabase";
import {
  CotizacionDocument,
  type PdfItem,
} from "@/lib/pdf/cotizacion-document";
import React from "react";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const { data: cotizacion, error: errorCot } = await supabase
    .from("cotizaciones")
    .select("*, clientes(*)")
    .eq("id", id)
    .single();

  if (errorCot || !cotizacion) {
    return NextResponse.json(
      { error: "Cotización no encontrada" },
      { status: 404 }
    );
  }

  const { data: itemsDb } = await supabase
    .from("cotizacion_items")
    .select("*, productos(nombre)")
    .eq("cotizacion_id", id);

  const { data: empresas } = await supabase
    .from("empresas")
    .select("*")
    .limit(1);

  const empresaRow = empresas?.[0];
  const empresa = {
    nombre: empresaRow?.nombre ?? "Mi Empresa",
    nit: empresaRow?.nit ?? null,
    direccion: empresaRow?.direccion ?? null,
    telefono: empresaRow?.telefono ?? null,
  };

  const clienteRaw = (cotizacion as { clientes?: Record<string, unknown> | null })
    .clientes;
  const cliente = {
    nombre: (clienteRaw?.nombre as string) ?? "Cliente",
    nit: (clienteRaw?.nit as string | null) ?? null,
    email: (clienteRaw?.email as string | null) ?? null,
    telefono: (clienteRaw?.telefono as string | null) ?? null,
    direccion: (clienteRaw?.direccion as string | null) ?? null,
  };

  const items: PdfItem[] = (itemsDb ?? []).map((item) => {
    const prod = item.productos as { nombre?: string } | null;
    return {
      nombre: prod?.nombre ?? "Producto",
      cantidad: Number(item.cantidad) || 0,
      precio_unitario: Number(item.precio_unitario) || 0,
      descuento: Number(item.descuento) || 0,
      subtotal: Number(item.subtotal) || 0,
    };
  });

  const doc = React.createElement(CotizacionDocument, {
    empresa,
    cliente,
    cotizacion: {
      numero: cotizacion.numero,
      fecha: cotizacion.fecha,
      subtotal: Number(cotizacion.subtotal) || 0,
      iva: Number(cotizacion.iva) || 0,
      total: Number(cotizacion.total) || 0,
      observaciones: cotizacion.observaciones,
    },
    items,
  });

  const buffer = await renderToBuffer(doc as React.ReactElement);

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${cotizacion.numero}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
