# Skill: patrón "lista + diálogo de creación" (Clientes/Productos)

Para una sección simple de solo listar + crear (sin editar/eliminar, fuera de
alcance del MVP salvo que se pida explícitamente), replicar exactamente 3
archivos por sección, dentro de `src/app/<seccion>/`:

1. `page.tsx` — Server Component (sin `"use client"`), `async function`, hace
   `await supabase.from("<tabla>").select("*").order("created_at", { ascending: false })`
   y renderiza `Card` > `Table` (shadcn). Maneja explícitamente el caso
   `error` (mensaje de error genérico + sugerencia de revisar conexión) y el
   caso lista vacía (`TableRow` con `colSpan` y texto "No hay X aún.").
   Header con `flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`
   (título+subtítulo a la izquierda, diálogo de creación a la derecha).

2. `nuevo-<algo>-dialog.tsx` — Client Component (`"use client"`). Estado local
   con `useState` para `open`, `pending`, `error` (NO react-hook-form, NO
   librerías extra — el proyecto no las usa). `handleSubmit` hace
   `event.preventDefault()`, arma `new FormData(form)`, llama a la server
   action, si `resultado.error` lo muestra y no cierra el diálogo; si no,
   `form.reset()` + `setOpen(false)`. Usa `DialogTrigger render={<Button .../>}`
   y `DialogClose render={<Button type="button" variant="outline" />}` (patrón
   base-ui `render`, ver skill `link-como-button.md`).

3. `actions.ts` — `"use server"`. Helper `campoOpcional(value)` para trimear
   campos de texto opcionales y devolver `null` si quedan vacíos. Validación
   mínima de campos obligatorios ANTES de llamar a Supabase, devolviendo
   `{ error: string }` (nunca lanzar excepción hacia el cliente). Al insertar
   con éxito: `revalidatePath("/<seccion>")` y devolver `{ error: null }`.

Ejemplo de referencia completo: `src/app/clientes/` (page.tsx,
nuevo-cliente-dialog.tsx, actions.ts) y `src/app/productos/` (mismo patrón,
añadiendo un campo numérico `precio` con `<Input type="number" step="0.01" min="0">`
y un booleano `lleva_iva` con `Checkbox` — ver
`semantic/componentes-shadcn-instalados/instalados.md`).

## Hallazgo crítico: `interface` vs `type` en `src/types/database.ts` rompe el build

La versión instalada de `@supabase/postgrest-js` (2.109.0, vía
`@supabase/supabase-js` 2.109.0) tipa `SupabaseClient<Database>` exigiendo que
`Database["public"]` sea estructuralmente asignable a su `GenericSchema`
interno, que a su vez exige que cada tabla tenga
`Row/Insert/Update extends Record<string, unknown>` y `Relationships:
GenericRelationship[]`, y que el schema tenga `Views`/`Functions` (aunque sea
`Record<string, never>`).

**Gotcha de TypeScript (no de Supabase):** un tipo declarado con `interface`
(p. ej. `export interface Cliente { nombre: string; ... }`) NUNCA satisface un
`extends Record<string, unknown>`, aunque tenga exactamente esas propiedades
— TypeScript exige una firma de índice explícita o que el tipo sea un
**alias de objeto literal** (`export type Cliente = { nombre: string; ... }`),
no una `interface`. Si esto falla, `supabase.from("tabla").insert({...})`
infiere el parámetro como `never[]` y tira
`Object literal may only specify known properties, and 'x' does not exist in type 'never[]'`
en CUALQUIER archivo que haga `.insert(...)` — el error señala el archivo que
llama `.insert`, no el archivo con el problema real (`types/database.ts`).

**Fix aplicado (2026-07-31):** en `src/types/database.ts`, todos los tipos de
fila (`Empresa`, `Cliente`, `Producto`, `Cotizacion`, `CotizacionItem`) usan
`export type X = {...}` (no `interface`), y cada tabla dentro de `Database`
tiene `Relationships: [];`, y el schema `public` tiene
`Views: Record<string, never>; Functions: Record<string, never>;`.

Si en una futura invocación `npm run build` falla con
`does not exist in type 'never[]'` en una llamada `.insert(...)` de cualquier
tabla, revisar primero `src/types/database.ts` por este mismo motivo antes de
tocar el archivo que reporta el error — es casi seguro un `interface` que
debería ser `type`, o falta `Relationships`/`Views`/`Functions`. Aunque
`types/database.ts` es en principio dominio de `supabase-forja`, este tipo de
arreglo es plomería de TypeScript para satisfacer el contrato de la librería
del cliente — no cambia columnas, tablas ni RLS reales — así que es razonable
que `frontend-forja` lo corrija cuando bloquea el build, dejándolo documentado
aquí.
