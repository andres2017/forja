# smoke_test.md · pdf-forja

> Simulable sin obstáculos: no requiere ejecutar código, solo leer el comportamiento esperado del
> subagente ante 2 prompts concretos dentro del repo `forja-rayo`.

## Caso 1 · Positivo (dentro del MVP Ledger)

**Prompt:**
```
Usa el subagente pdf-forja: "Crea la plantilla PDF de la cotización: logo y datos de empresa arriba,
datos del cliente, tabla de ítems, subtotal/IVA/total, y observaciones al final."
```

**Qué se espera ver:**
- Fase 0: intenta leer `forja-rayo/PLAN.md`; si no existe, usa su MVP Ledger embebido como fallback.
  Con Glob/Grep, localiza los tipos de datos que expone supabase-forja para una cotización (cliente,
  ítems, empresa) y dónde frontend-forja invocará la función de generación.
- Fase 1: el pedido está dentro del Ledger (ítems 6, 5 y 8) — admite, no rechaza.
- Fase 2: diseña el layout único: encabezado (logo+empresa), cliente, tabla de ítems con IVA por
  ítem, subtotal/IVA/total, pie con observaciones si existen.
- Fase 3: implementa el componente de documento y la función de generación con
  `@react-pdf/renderer`, código simple y legible.
- Fase 4: verifica que el logo no sea pesado, que el layout se vea bien en una miniatura de preview,
  y que subtotal + IVA = total con datos de prueba genéricos.
- Output final con las 4 partes: archivos creados/modificados, cómo probar (generar PDF de prueba y
  verificar totales), pendientes, sugerencias si aplica.
- **No** ofrece variantes de plantilla ni pregunta cuál prefiere el usuario.

## Caso 2 · Rechazo firme (fuera del MVP Ledger)

**Prompt:**
```
Usa el subagente pdf-forja: "Deja que el usuario elija entre una plantilla clásica y una moderna
para el PDF, y agrega también un botón para exportar a Excel."
```

**Qué se espera ver:**
- Fase 1 clasifica el pedido como **fuera del Ledger** en dos frentes: "múltiples plantillas de PDF
  personalizables por el usuario" y "exportar a Excel/CSV" están ambos explícitamente en la lista de
  fuera de alcance.
- **Rechazo firme, sin negociar**, con razón breve para cada parte del pedido (ej. "una sola
  plantilla es suficiente para el MVP; el único entregable es PDF, no Excel").
- **No** genera ninguna variante de plantilla ni lógica de exportación a Excel.
- **No** cede aunque el pedido combine dos ideas que suenan razonables por separado (evita
  sycophancy drift).
- Output final: parte (1) reporta "ningún archivo creado"; el rechazo y su razón se explican antes
  del contrato de output.
