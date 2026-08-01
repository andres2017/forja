import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a2e",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: "#1F4E79",
    paddingBottom: 12,
  },
  empresaNombre: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#1F4E79",
    marginBottom: 4,
  },
  empresaDato: {
    fontSize: 9,
    color: "#5a6a7a",
    marginBottom: 2,
  },
  tituloDoc: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#1F4E79",
    textAlign: "right",
  },
  numeroDoc: {
    fontSize: 11,
    textAlign: "right",
    marginTop: 4,
  },
  fechaDoc: {
    fontSize: 9,
    color: "#5a6a7a",
    textAlign: "right",
    marginTop: 2,
  },
  seccion: {
    marginBottom: 16,
  },
  seccionTitulo: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1F4E79",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  clienteNombre: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  clienteDato: {
    fontSize: 9,
    color: "#5a6a7a",
    marginBottom: 1,
  },
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1F4E79",
    color: "#ffffff",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableRowAlt: {
    backgroundColor: "#f8fafc",
  },
  colProducto: { width: "36%" },
  colCant: { width: "10%", textAlign: "right" },
  colPrecio: { width: "18%", textAlign: "right" },
  colDesc: { width: "16%", textAlign: "right" },
  colSub: { width: "20%", textAlign: "right" },
  headerText: {
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
  totalesBox: {
    marginTop: 16,
    alignSelf: "flex-end",
    width: 200,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 10,
    color: "#5a6a7a",
  },
  totalValue: {
    fontSize: 10,
  },
  totalFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#1F4E79",
    paddingTop: 6,
    marginTop: 4,
  },
  totalFinalLabel: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1F4E79",
  },
  totalFinalValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1F4E79",
  },
  observaciones: {
    marginTop: 24,
    padding: 10,
    backgroundColor: "#f0f5fa",
    borderRadius: 4,
  },
  observacionesTitulo: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    marginBottom: 4,
    color: "#1F4E79",
  },
  observacionesTexto: {
    fontSize: 9,
    color: "#333",
    lineHeight: 1.4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#94a3b8",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 8,
  },
});

function formato(n: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);
}

export type PdfEmpresa = {
  nombre: string;
  nit: string | null;
  direccion: string | null;
  telefono: string | null;
};

export type PdfCliente = {
  nombre: string;
  nit: string | null;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
};

export type PdfItem = {
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  descuento: number;
  subtotal: number;
};

export type PdfCotizacion = {
  numero: string;
  fecha: string;
  subtotal: number;
  iva: number;
  total: number;
  observaciones: string | null;
};

export function CotizacionDocument({
  empresa,
  cliente,
  cotizacion,
  items,
}: {
  empresa: PdfEmpresa;
  cliente: PdfCliente;
  cotizacion: PdfCotizacion;
  items: PdfItem[];
}) {
  const fechaFmt = cotizacion.fecha
    ? new Date(cotizacion.fecha + "T12:00:00").toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.empresaNombre}>{empresa.nombre}</Text>
            {empresa.nit ? (
              <Text style={styles.empresaDato}>NIT: {empresa.nit}</Text>
            ) : null}
            {empresa.direccion ? (
              <Text style={styles.empresaDato}>{empresa.direccion}</Text>
            ) : null}
            {empresa.telefono ? (
              <Text style={styles.empresaDato}>{empresa.telefono}</Text>
            ) : null}
          </View>
          <View>
            <Text style={styles.tituloDoc}>COTIZACIÓN</Text>
            <Text style={styles.numeroDoc}>{cotizacion.numero}</Text>
            <Text style={styles.fechaDoc}>{fechaFmt}</Text>
          </View>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Cliente</Text>
          <Text style={styles.clienteNombre}>{cliente.nombre}</Text>
          {cliente.nit ? (
            <Text style={styles.clienteDato}>NIT: {cliente.nit}</Text>
          ) : null}
          {cliente.email ? (
            <Text style={styles.clienteDato}>{cliente.email}</Text>
          ) : null}
          {cliente.telefono ? (
            <Text style={styles.clienteDato}>{cliente.telefono}</Text>
          ) : null}
          {cliente.direccion ? (
            <Text style={styles.clienteDato}>{cliente.direccion}</Text>
          ) : null}
        </View>

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Detalle</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerText, styles.colProducto]}>
                Producto / Servicio
              </Text>
              <Text style={[styles.headerText, styles.colCant]}>Cant.</Text>
              <Text style={[styles.headerText, styles.colPrecio]}>Precio</Text>
              <Text style={[styles.headerText, styles.colDesc]}>Desc.</Text>
              <Text style={[styles.headerText, styles.colSub]}>Subtotal</Text>
            </View>
            {items.map((item, i) => (
              <View
                key={i}
                style={i % 2 === 1 ? [styles.tableRow, styles.tableRowAlt] : styles.tableRow}
              >
                <Text style={styles.colProducto}>{item.nombre}</Text>
                <Text style={styles.colCant}>{item.cantidad}</Text>
                <Text style={styles.colPrecio}>
                  {formato(item.precio_unitario)}
                </Text>
                <Text style={styles.colDesc}>{formato(item.descuento)}</Text>
                <Text style={styles.colSub}>{formato(item.subtotal)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.totalesBox}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formato(cotizacion.subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>IVA (19%)</Text>
            <Text style={styles.totalValue}>{formato(cotizacion.iva)}</Text>
          </View>
          <View style={styles.totalFinal}>
            <Text style={styles.totalFinalLabel}>Total</Text>
            <Text style={styles.totalFinalValue}>
              {formato(cotizacion.total)}
            </Text>
          </View>
        </View>

        {cotizacion.observaciones ? (
          <View style={styles.observaciones}>
            <Text style={styles.observacionesTitulo}>Observaciones</Text>
            <Text style={styles.observacionesTexto}>
              {cotizacion.observaciones}
            </Text>
          </View>
        ) : null}

        <Text style={styles.footer}>
          Documento generado con Forja Rayo · Validez según condiciones
          indicadas · Precios en pesos colombianos (COP)
        </Text>
      </Page>
    </Document>
  );
}
