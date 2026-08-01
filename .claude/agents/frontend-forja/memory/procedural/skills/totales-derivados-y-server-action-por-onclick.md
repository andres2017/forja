# Skill: totales derivados en vivo + Server Action invocada por onClick con objeto plano

## Totales en vivo (subtotal/IVA/total)

Cuando un formulario tiene filas dinámicas (`items: ItemRow[]`) y hace falta
mostrar subtotal general, IVA y total que se actualicen solos al cambiar
cualquier fila: NO guardarlos en `useState` aparte. Calcularlos como
variables derivadas directamente en el cuerpo del componente, en cada render,
a partir de `items` + `productos` (mismo patrón que ya usa
`calcularSubtotalFila` por fila individual):

```tsx
const subtotalGeneral = items.reduce(
  (acc, item) => acc + calcularSubtotalFila(item),
  0
);
const iva = items.reduce((acc, item) => {
  const producto = productos.find((p) => p.id === item.productoId);
  if (!producto?.lleva_iva) return acc; // solo suma IVA si el producto lo lleva
  return acc + calcularSubtotalFila(item) * 0.19;
}, 0);
const total = subtotalGeneral + iva;
```

`useMemo` es opcional (no obligatorio) para este tamaño de listas — priorizar
simplicidad. Antes de persistir estos valores en Supabase, redondear a 2
decimales con `Math.round(valor * 100) / 100` para evitar arrastrar residuos
de punto flotante (ej. sumas de descuentos con `step="0.01"`).

## Server Action invocada desde un onClick con un objeto plano (no FormData)

Cuando el guardado no viene de un `<form>` simple sino de un botón que debe
enviar datos ya armados en estado de React (ej. un array de ítems calculado),
es más simple pasar un objeto plano serializable directamente como argumento
de la Server Action, en vez de serializarlo a mano dentro de un `FormData`:

```tsx
// Client Component
const resultado = await guardarCotizacion({ clienteId, items, subtotal, iva, total, observaciones });
if (resultado.error) { setError(resultado.error); setGuardando(false); }
// si no hay error, la action ya redirigió server-side (ver abajo)
```

```ts
// actions.ts, "use server"
export async function guardarCotizacion(payload: GuardarCotizacionPayload) {
  // validar payload (cliente_id presente, items.length > 0) ANTES de tocar Supabase
  // ... insert cotizaciones -> obtener id -> insert cotizacion_items ...
  redirect("/"); // última línea, sin try/catch envolviéndola, sin "return" explícito
}
```

Confirmado en `node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md`
(sección "Event Handlers"): un Server Function se puede invocar como función
async normal con cualquier argumento serializable, no solo desde `<form
action>`. Sigue siendo una Server Action válida (misma seguridad, mismo
mecanismo de despacho) — solo cambia cómo se le pasan los datos.

`redirect()` (de `next/navigation`) lanza una excepción de control de flujo
(`NEXT_REDIRECT`) manejada por el framework — por eso:
- Va **fuera** de cualquier bloque `try/catch` dentro de la action.
- No hace falta `return redirect(...)`, porque su tipo de retorno es `never`
  y TypeScript entiende que el código después es inalcanzable (confirmado en
  `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/redirect.md`).
- Llamar `redirect()` directamente en un Client Component **dentro de un
  event handler** SÍ está prohibido (usar `useRouter` en ese caso) — pero
  llamarlo dentro de una Server Action (`"use server"`) invocada desde un
  event handler es el patrón soportado y documentado.

Referencia completa: `src/app/cotizaciones/nueva/actions.ts` (server action
`guardarCotizacion`) + `src/app/cotizaciones/nueva/nueva-cotizacion-form.tsx`
(`handleGuardar`, totales derivados, estados `guardando`/`error`).

Numeración simple tipo `COT-{año}-XXXX`: contar filas existentes con
`.select("id", { count: "exact", head: true }).like("numero", "COT-{año}-%")`,
sumar 1, `String(n).padStart(4, "0")`. Sin manejo de condiciones de carrera
(aceptable para MVP de hackathon de un solo usuario) — no complejizar con
locks/transacciones a menos que se pida explícitamente.
