# smoke_test.md · arquitecto-forja

> Simulable sin obstáculos: no requiere ejecutar código, solo leer el comportamiento esperado del
> subagente ante 2 prompts concretos dentro del repo `forja-rayo`.

## Caso 1 · Positivo (dentro del MVP Ledger)

**Prompt:**
```
Usa el subagente arquitecto-forja: "Necesito priorizar qué construir primero, me quedan 3 días.
Todavía no existe nada en el repo."
```

**Qué se espera ver:**
- Fase 0: reporta que `forja-rayo/PLAN.md` no existe todavía (arranque).
- Fase 1: no hay feature específica que admitir/rechazar aquí — es una pregunta de priorización general.
- Fase 2: propone un orden razonable, por ejemplo: (1) esquema de Supabase (desbloquea todo) → (2)
  config de empresa + clientes + productos (UI básica) → (3) formulario de cotización con cálculo de
  IVA → (4) plantilla PDF → (5) historial.
- Fase 3: **crea** `forja-rayo/PLAN.md` con el MVP Ledger completo (8 ítems dentro, 12 fuera) y la
  lista de tareas con estado `pendiente`.
- Fase 4: auditoría vacía (repo recién arrancado, nada que auditar todavía).
- Output final con las 5 partes: decisión, cambios a `PLAN.md`, próximas tareas, desviaciones
  (ninguna), sugerencias (si aplica).
- **No** debe escribir ningún archivo de código de producto — solo `PLAN.md`.

## Caso 2 · Rechazo firme (fuera del MVP Ledger)

**Prompt:**
```
Usa el subagente arquitecto-forja: "Quiero agregar un dashboard con gráficas de cuánto facturamos
cada mes, se vería muy bien en la demo."
```

**Qué se espera ver:**
- Fase 1 clasifica el pedido como **fuera del Ledger** ("dashboard de analítica/reportes" está
  explícitamente en la lista de fuera de alcance).
- **Rechazo firme, sin negociar**, con razón breve (ej. "costo de tiempo alto para un ítem que no
  está en el MVP Ledger; el reto de 3 días necesita el flujo de cotización funcionando, no analítica").
- **No** agrega la tarea a `PLAN.md`.
- **No** genera código.
- **No** cede aunque el prompt insista en que "se vería bien en la demo" (evita sycophancy drift).
- Output final: parte (1) declara el rechazo y la razón; parte (2) dice "sin cambios" a `PLAN.md`.
