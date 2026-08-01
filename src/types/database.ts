// Nota: estos tipos de fila usan `type` (no `interface`) a propósito. La
// versión instalada de @supabase/postgrest-js exige que cada `Row`/`Insert`/
// `Update` satisfaga `Record<string, unknown>`, y en TypeScript un `interface`
// (a diferencia de un `type` con objeto literal) no cumple un `extends
// Record<string, unknown>`, aunque tenga exactamente las mismas propiedades.
// Con `interface` aquí, el cliente de Supabase tipado infiere `never` para
// Insert/Update y rompe `npm run build`.
export type Empresa = {
  id: string;
  nombre: string;
  nit: string | null;
  direccion: string | null;
  telefono: string | null;
  logo_url: string | null;
  created_at: string;
};

export type Cliente = {
  id: string;
  nombre: string;
  nit: string | null;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  created_at: string;
};

export type Producto = {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  lleva_iva: boolean;
  created_at: string;
};

export type Cotizacion = {
  id: string;
  cliente_id: string;
  numero: string;
  fecha: string;
  subtotal: number;
  iva: number;
  total: number;
  observaciones: string | null;
  created_at: string;
};

export type CotizacionItem = {
  id: string;
  cotizacion_id: string;
  producto_id: string | null;
  cantidad: number;
  precio_unitario: number;
  descuento: number;
  subtotal: number;
};

export interface Database {
  public: {
    Tables: {
      empresas: {
        Row: Empresa;
        Insert: Omit<Empresa, "id" | "created_at">;
        Update: Partial<Omit<Empresa, "id" | "created_at">>;
        Relationships: [];
      };
      clientes: {
        Row: Cliente;
        Insert: Omit<Cliente, "id" | "created_at">;
        Update: Partial<Omit<Cliente, "id" | "created_at">>;
        Relationships: [];
      };
      productos: {
        Row: Producto;
        Insert: Omit<Producto, "id" | "created_at">;
        Update: Partial<Omit<Producto, "id" | "created_at">>;
        Relationships: [];
      };
      cotizaciones: {
        Row: Cotizacion;
        Insert: Omit<Cotizacion, "id" | "created_at">;
        Update: Partial<Omit<Cotizacion, "id" | "created_at">>;
        Relationships: [];
      };
      cotizacion_items: {
        Row: CotizacionItem;
        Insert: Omit<CotizacionItem, "id">;
        Update: Partial<Omit<CotizacionItem, "id">>;
        Relationships: [];
      };
    };
    // Requeridos por el tipo GenericSchema de @supabase/postgrest-js
    // (esta versión exige Views/Functions aunque estén vacíos, o el
    // cliente tipado cae a `never` para todas las tablas).
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
