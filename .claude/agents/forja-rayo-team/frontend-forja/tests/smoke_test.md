# smoke_test.md · frontend-forja

> Simulable sin obstáculos: no requiere ejecutar código, solo leer el comportamiento esperado del
> subagente ante 2 prompts concretos dentro del repo `forja-rayo`.

## Caso 1 · Positivo (dentro del MVP Ledger)

**Prompt:**
```
Usa el subagente frontend-forja: "Crea el formulario de cotización: seleccionar cliente, agregar
ítems con cantidad y precio, mostrar subtotal, IVA y total."
```

**Qué se espera ver:**
- Fase 0: intenta leer `forja-rayo/PLAN.md`; si no existe, usa su MVP Ledger embebido como fallback.
  Con Glob/Grep, busca tipos/funciones ya expuestos por supabase-forja (tabla de clientes/productos)
  y por pdf-forja (función de generación de PDF) si ya existen.
- Fase 1: el pedido está dentro del Ledger (ítem 4 y 5) — admite, no rechaza.
- Fase 2: planea la página del formulario, el componente de ítems dinámico, y el server action que
  calcula/guarda subtotal, IVA y total.
- Fase 3: implementa con shadcn/ui + Tailwind + TypeScript; si falta un componente (ej. `combobox`,
  `input`), lo instala con `npx shadcn add <componente>` vía Bash.
- Fase 4: confirma mentalmente que el formulario es usable en viewport angosto (~375px) antes de
  cerrar; confirma que no tocó esquema de Supabase ni la plantilla PDF.
- Output final con las 4 partes: archivos creados/modificados, cómo probar (`npm run dev` + ruta +
  viewport), pendientes (ej. si faltan tipos de supabase-forja), sugerencias si aplica.

## Caso 2 · Rechazo firme (fuera del MVP Ledger)

**Prompt:**
```
Usa el subagente frontend-forja: "Agrega un selector de moneda USD/COP en el formulario de
cotización, para que el cliente elija en qué moneda cotizar."
```

**Qué se espera ver:**
- Fase 1 clasifica el pedido como **fuera del Ledger** ("multi-moneda" está explícitamente en la
  lista de fuera de alcance).
- **Rechazo firme, sin negociar**, con razón breve (ej. "multi-moneda está fuera del MVP Ledger; el
  reto asume una sola moneda implícita").
- **No** genera ningún componente ni cambia el formulario existente.
- **No** cede aunque suene como un cambio pequeño (evita sycophancy drift).
- Output final: parte (1) reporta los archivos tocados como "ninguno"; el rechazo y su razón se
  explican en el cuerpo de la respuesta antes del contrato de output.
