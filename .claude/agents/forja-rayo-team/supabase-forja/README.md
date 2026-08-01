# supabase-forja

Subagente de Claude Code · Tier Ops · especialista Supabase del proyecto **forja-rayo** (generador
de cotizaciones profesionales con IA, hackathon "Forja" de 3 días).

## Qué hace

Diseña el modelo de datos mínimo del MVP (empresa, clientes, productos, cotizaciones, ítems de
cotización), políticas RLS simples de un solo usuario/empresa, auth mínima (email/password o magic
link), y el storage del logo de empresa. Rechaza sobre-diseño (auditoría, versionado histórico
complejo, multi-tenant avanzado).

## Cómo desplegarlo

Ya está desplegado en `C:\Users\ANDRES\forja-rayo\.claude\agents\supabase-forja.md`. Si necesitas
volver a copiarlo, ejecuta en PowerShell:

```powershell
Copy-Item "C:\Users\ANDRES\ALAN-4AI_v1.0_alumnos_2026-07-24\ALAN-4AI\output\forja-rayo-team\supabase-forja\templates\supabase-forja.subagent.md" -Destination "C:\Users\ANDRES\forja-rayo\.claude\agents\supabase-forja.md" -Force
```

Claude Code detecta subagentes en `.claude/agents/*.md` dentro del repo destino automáticamente —
no hace falta reiniciar la sesión, solo abrir/continuar Claude Code dentro de `forja-rayo`.

## Ejemplos de invocación

```
# Auto-delegación (Claude Code decide solo, por la description del subagente)
"Diseña las tablas de Supabase para clientes, productos y cotizaciones"
"Configura auth simple con email y password para forja-rayo"

# Invocación explícita
"Usa el subagente supabase-forja para el storage del logo de empresa"
```

## Ejemplos de rechazo firme

- **"Agrega una tabla de auditoría que registre cada cambio con historial de versiones completo."**
  → Rechazado: sobre-diseño para un MVP de 3 días.
- **"Necesito soporte multi-tenant con organizaciones, equipos y roles por tabla."** → Rechazado:
  roles/multi-usuario avanzado está fuera del MVP Ledger.

## Estructura de este paquete

```
supabase-forja/
├── CLAUDE.md                        Filosofía, restricciones, 13 anti-patterns adaptados
├── agent.md                         Invocación, pipeline de 5 fases, contrato de output, memoria
├── README.md                        Este archivo
├── templates/
│   └── supabase-forja.subagent.md   Copia idéntica del subagente desplegado en .claude/agents/
└── tests/
    └── smoke_test.md                1 caso positivo + 1 caso de rechazo, simulables sin obstáculos
```

## Memoria

Vive dentro del repo `forja-rayo`, no en este paquete:
`forja-rayo/.claude/agents/supabase-forja/memory/` (episodic.jsonl, semantic/, procedural/skills/).
Se crea sola en la primera invocación. Detalle completo en `agent.md`.
