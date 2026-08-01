# frontend-forja

Subagente de Claude Code · Tier Ops · especialista Next.js 15 App Router + TypeScript + Tailwind +
shadcn/ui del proyecto **forja-rayo** (generador de cotizaciones profesionales con IA, hackathon
"Forja" de 3 días).

## Qué hace

Crea/edita páginas, formularios, tablas y componentes (config de empresa, clientes, productos,
formulario de cotización, historial), y la lógica de servidor simple (server actions/route handlers)
que conecta con Supabase y con la IA de "observaciones". No diseña esquema/RLS de Supabase ni la
plantilla de PDF.

## Cómo desplegarlo

Ya está desplegado en `C:\Users\ANDRES\forja-rayo\.claude\agents\frontend-forja.md`. Si necesitas
volver a copiarlo, ejecuta en PowerShell:

```powershell
Copy-Item "C:\Users\ANDRES\ALAN-4AI_v1.0_alumnos_2026-07-24\ALAN-4AI\output\forja-rayo-team\frontend-forja\templates\frontend-forja.subagent.md" -Destination "C:\Users\ANDRES\forja-rayo\.claude\agents\frontend-forja.md" -Force
```

Claude Code detecta subagentes en `.claude/agents/*.md` dentro del repo destino automáticamente —
no hace falta reiniciar la sesión, solo abrir/continuar Claude Code dentro de `forja-rayo`.

## Ejemplos de invocación

```
# Auto-delegación (Claude Code decide solo, por la description del subagente)
"Crea el formulario de cotización con cliente, ítems, subtotal, IVA y total"
"Arma la página de historial de cotizaciones con opción de volver a descargar el PDF"

# Invocación explícita
"Usa el subagente frontend-forja para el CRUD de clientes"
```

## Ejemplos de rechazo firme

- **"Agrega una pantalla de reportes con gráficas de ventas del mes."** → Rechazado: dashboard de
  analítica/reportes está fuera del MVP Ledger.
- **"Pon un selector de moneda USD/COP en el formulario de cotización."** → Rechazado: multi-moneda
  está fuera del MVP Ledger.

## Estructura de este paquete

```
frontend-forja/
├── CLAUDE.md                        Filosofía, restricciones, 13 anti-patterns adaptados
├── agent.md                         Invocación, pipeline de 5 fases, contrato de output, memoria
├── README.md                        Este archivo
├── templates/
│   └── frontend-forja.subagent.md   Copia idéntica del subagente desplegado en .claude/agents/
└── tests/
    └── smoke_test.md                1 caso positivo + 1 caso de rechazo, simulables sin obstáculos
```

## Memoria

Vive dentro del repo `forja-rayo`, no en este paquete:
`forja-rayo/.claude/agents/frontend-forja/memory/` (episodic.jsonl, semantic/, procedural/skills/).
Se crea sola en la primera invocación. Detalle completo en `agent.md`.
