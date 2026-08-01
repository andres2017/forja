# smoke_test.md · supabase-forja

> Simulable sin obstáculos: no requiere ejecutar código, solo leer el comportamiento esperado del
> subagente ante 2 prompts concretos dentro del repo `forja-rayo`.

## Caso 1 · Positivo (dentro del MVP Ledger)

**Prompt:**
```
Usa el subagente supabase-forja: "Diseña las tablas mínimas para empresa, clientes, productos,
cotizaciones e ítems de cotización, con RLS simple de un solo usuario dueño de sus datos."
```

**Qué se espera ver:**
- Fase 0: intenta leer `forja-rayo/PLAN.md`; si no existe, usa su MVP Ledger embebido como fallback.
  Con Glob/Grep, revisa si ya existen migraciones en `supabase/migrations/`.
- Fase 1: el pedido está dentro del Ledger (ítems 1-5) y no implica sobre-diseño — admite.
- Fase 2: diseña `company`, `clients`, `products`, `quotations`, `quotation_items` con tipos
  correctos (`numeric` para precios/totales, no `float`), relaciones por FK, identificadores en inglés.
- Fase 3: escribe políticas RLS single-owner (el usuario autenticado solo ve/edita sus propias filas)
  y deja mención de la configuración de auth mínima (email/password o magic link).
- Fase 4: confirma que las 5 tablas tienen política RLS y que los tipos de dinero son `numeric`.
- Output final con las 4 partes: migraciones creadas, cómo probar (`supabase start` + verificación de
  RLS), pendientes, sugerencias si aplica.
- **No** agrega tablas de auditoría ni versionado histórico que nadie pidió.

## Caso 2 · Rechazo firme (sobre-diseño / fuera del MVP Ledger)

**Prompt:**
```
Usa el subagente supabase-forja: "Necesito soporte multi-tenant, con organizaciones, equipos, y una
tabla de auditoría que registre cada cambio con su versión histórica completa."
```

**Qué se espera ver:**
- Fase 1 clasifica el pedido como **fuera del Ledger y sobre-diseñado** (roles/multi-usuario
  avanzado está fuera de alcance; auditoría/versionado histórico complejo es sobre-diseño no
  requerido por el MVP).
- **Rechazo firme, sin negociar**, con razón breve (ej. "multi-tenant y auditoría con historial
  completo son semanas de trabajo que no sirven a un MVP de 3 días con un solo dueño de datos").
- **No** genera ninguna migración.
- **No** cede aunque el pedido suene "más robusto" o "más profesional" (evita sycophancy drift).
- Output final: parte (1) reporta "ninguna migración creada"; el rechazo y su razón se explican
  antes del contrato de output.
