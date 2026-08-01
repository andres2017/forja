# Skill: Server Component con fetch + Client Component con filas dinámicas

Para una página que necesita (a) datos iniciales reales de Supabase (ej.
listas de clientes/productos para poblar selects) y (b) interactividad rica
(agregar filas, inputs controlados, cálculos en tiempo real por fila), NO usar
"use client" en todo `page.tsx` ni hacer fetch desde el cliente con
`useEffect`. Separar en dos archivos:

1. `page.tsx` — sigue siendo `async function` Server Component (sin
   `"use client"`). Hace el/los fetch(es) con `await supabase.from(...).select(...)`
   (usar `Promise.all` si son varias tablas independientes), maneja el caso
   `error` igual que en `clientes/page.tsx`/`productos/page.tsx` (card con
   mensaje genérico), y le pasa los arrays ya resueltos como props a un Client
   Component (`clientes={clientes ?? []}`).

2. `<algo>-form.tsx` — `"use client"`, recibe esos arrays como props
   (tipados con los `type` de `@/types/database`, ej. `Cliente[]`,
   `Producto[]`) y maneja SOLO el estado de interacción con `useState` (nada
   de librerías de formularios ni state managers externos). Patrón para
   "filas dinámicas" (ej. ítems de una cotización):

```tsx
type ItemRow = { id: string; productoId: string | null; cantidad: string; descuento: string };

const [items, setItems] = useState<ItemRow[]>([]);

function agregarItem() {
  setItems((prev) => [...prev, crearFila()]); // crearFila() genera un id único simple (contador local, no crypto.randomUUID necesario)
}

function actualizarItem(id: string, cambios: Partial<ItemRow>) {
  setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...cambios } : it)));
}
```

- Campos numéricos editables por el usuario (cantidad, descuento) se guardan
  como `string` en el estado, no `number` — evita el bug clásico de "no puedo
  borrar el último dígito" de un input controlado con estado numérico. El
  cálculo (`Number(valor) || 0`) se hace solo al momento de renderizar/derivar
  el subtotal, nunca al guardar en el estado.
- Campos derivados de otra selección (ej. precio del producto elegido) NO se
  guardan en el estado de la fila — se derivan en cada render con
  `productos.find(p => p.id === row.productoId)`. Menos estado, menos
  desincronización.
- Referencia completa: `src/app/cotizaciones/nueva/page.tsx` (fetch) +
  `src/app/cotizaciones/nueva/nueva-cotizacion-form.tsx` (estado e
  interactividad: Select de cliente + tabla de ítems con Select de producto,
  Input de cantidad/descuento y subtotal calculado por fila).

Este patrón es distinto del de `patron-crud-simple-lista-mas-dialogo.md`
(lista + diálogo modal de creación): úsalo cuando la interactividad vive
directamente en la página principal (un formulario largo), no en un diálogo
aparte.
