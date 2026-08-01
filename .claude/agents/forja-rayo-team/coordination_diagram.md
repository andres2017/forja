# coordination_diagram.md · Coordinación humana + PLAN.md compartido

> Decisión de diseño deliberada: **sin** herramienta `Task` entre estos 4 agentes. El developer no es
> experto en frameworks y tiene 3 días — un orquestador multi-agente añadiría complejidad sin
> beneficio real para un hackathon. El humano invoca a cada agente cuando lo necesita, y el
> desacople entre agentes se logra con un solo archivo compartido: `forja-rayo/PLAN.md`.

## Diagrama ASCII

```
                         ┌─────────────────────────────┐
                         │   Desarrollador (humano)     │
                         │  invoca cada agente a mano,   │
                         │  en Claude Code, cuando lo     │
                         │  necesita — nunca automático   │
                         └───────────────┬───────────────┘
                                         │
                 invoca uno a la vez, según la tarea del momento
                                         │
        ┌────────────────┬──────────────┼──────────────┬────────────────┐
        ▼                ▼              ▼              ▼                │
┌───────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────┐        │
│ arquitecto-    │ │ frontend-    │ │ supabase-    │ │ pdf-     │        │
│ forja          │ │ forja        │ │ forja        │ │ forja    │        │
│ (Read/Write/   │ │ (+Bash:      │ │ (+Bash:      │ │ (Read/   │        │
│  Edit/Glob/    │ │  shadcn/npm) │ │  supabase CLI│ │ Write/   │        │
│  Grep)         │ │              │ │ )            │ │ Edit/    │        │
│                │ │              │ │              │ │ Glob/Grep)│       │
└───────┬────────┘ └──────┬───────┘ └──────┬───────┘ └────┬─────┘        │
        │                 │                │              │              │
        │ ÚNICO que       │ solo LEE       │ solo LEE     │ solo LEE     │
        │ ESCRIBE          │ (fallback:     │ (fallback:    │ (fallback:   │
        │ PLAN.md          │ Ledger propio) │ Ledger propio)│ Ledger propio)│
        ▼                 ▲                ▲              ▲              │
┌─────────────────────────┴────────────────┴──────────────┴──────────────┘
│              forja-rayo/PLAN.md  (archivo compartido, texto plano)
│  - MVP Ledger completo (copiado por arquitecto-forja)
│  - Lista de tareas ordenada: pendiente / en progreso / hecho
│  - Quién ejecuta cada tarea (frontend-forja / supabase-forja / pdf-forja)
│  - Desviaciones detectadas en auditorías
└───────────────────────────────────────────────────────────────────────┘
```

## Reglas del mecanismo

1. **Solo `arquitecto-forja` escribe `PLAN.md`.** Lo crea si no existe, lo actualiza (nunca lo
   reescribe borrando historial de decisiones) tras cada admisión/priorización/auditoría.
2. **Los otros 3 (`frontend-forja`, `supabase-forja`, `pdf-forja`) solo LEEN `PLAN.md`** al arrancar,
   si existe, para alinear prioridad y estado — nunca lo editan (evita conflictos de escritura entre
   agentes que corren en turnos distintos del humano).
3. **`PLAN.md` es opcional para el rechazo, no para la ejecución feliz.** Los 3 agentes de dominio
   llevan su propio MVP Ledger embebido en su prompt como fallback — pueden rechazar un pedido fuera
   de alcance aunque `PLAN.md` todavía no exista (por ejemplo, en la primera invocación del
   hackathon, antes de que `arquitecto-forja` haya corrido nunca).
4. **Sin `Task` tool, sin llamadas entre agentes.** Ningún agente invoca a otro directamente. La
   coordinación pasa siempre por el humano (que decide a quién invocar) y por `PLAN.md` (que informa
   esa decisión).
5. **Sin cola, sin locks, sin merge automático.** Es un hackathon de 3 días con un solo desarrollador
   trabajando de a un agente a la vez en la misma sesión de Claude Code — no hace falta más.

## Flujo típico de una tarea nueva

```
1. Developer tiene una idea de feature.
2. Invoca a arquitecto-forja → valida contra el MVP Ledger.
   a. Fuera de alcance → RECHAZO FIRME, fin. No se toca PLAN.md.
   b. Dentro de alcance → se agrega/prioriza en PLAN.md con estado "pendiente".
3. Developer invoca al agente de dominio correspondiente (frontend-forja / supabase-forja /
   pdf-forja) para ejecutar la tarea. Ese agente lee PLAN.md (si existe) para confirmar contexto,
   pero decide por su propio MVP Ledger si algo huele a fuera de alcance.
4. El agente de dominio entrega su contrato de output en el chat (archivos tocados, cómo probar,
   pendientes) — no actualiza PLAN.md él mismo.
5. Developer, más tarde, vuelve a invocar a arquitecto-forja para que audite el avance real del
   repo contra PLAN.md y actualice el estado de la tarea a "hecho" (o señale desviación).
```
