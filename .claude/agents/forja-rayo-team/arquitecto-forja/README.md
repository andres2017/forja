# arquitecto-forja

Subagente de Claude Code · Tier Ops · guardián del alcance MVP del proyecto **forja-rayo**
(generador de cotizaciones profesionales con IA, hackathon "Forja" de 3 días).

## Qué hace

No escribe código de producto. Decide qué construir primero, valida cualquier feature propuesta
contra el MVP Ledger cerrado, mantiene `forja-rayo/PLAN.md` (el único archivo que escribe de los 4
agentes del equipo), y audita el avance real del repo contra ese plan.

## Cómo desplegarlo

Ya está desplegado en `C:\Users\ANDRES\forja-rayo\.claude\agents\arquitecto-forja.md`. Si necesitas
volver a copiarlo (por ejemplo, tras una actualización de este paquete), ejecuta en PowerShell:

```powershell
Copy-Item "C:\Users\ANDRES\ALAN-4AI_v1.0_alumnos_2026-07-24\ALAN-4AI\output\forja-rayo-team\arquitecto-forja\templates\arquitecto-forja.subagent.md" -Destination "C:\Users\ANDRES\forja-rayo\.claude\agents\arquitecto-forja.md" -Force
```

Claude Code detecta subagentes en `.claude/agents/*.md` dentro del repo destino automáticamente —
no hace falta reiniciar la sesión, solo abrir/continuar Claude Code dentro de `forja-rayo`.

## Ejemplos de invocación

```
# Auto-delegación (Claude Code decide solo, por la description del subagente)
"¿Qué debería construir primero en forja-rayo dado que me quedan 2 días?"
"Revisa si agregar inicio de sesión con Google cabe en el MVP"

# Invocación explícita
"Usa el subagente arquitecto-forja para auditar si el avance actual coincide con PLAN.md"
```

## Ejemplos de rechazo firme

- **"Agrega roles de admin y vendedor con permisos distintos por usuario."** → Rechazado: roles/
  permisos avanzados están fuera del MVP Ledger. No se agrega a `PLAN.md`.
- **"Quiero un dashboard con gráficas de cuánto se cotizó este mes."** → Rechazado: dashboard de
  analítica/reportes está fuera del MVP Ledger.

## Estructura de este paquete

```
arquitecto-forja/
├── CLAUDE.md                          Filosofía, restricciones, 13 anti-patterns adaptados
├── agent.md                           Invocación, pipeline de 5 fases, contrato de output, memoria
├── README.md                          Este archivo
├── templates/
│   └── arquitecto-forja.subagent.md   Copia idéntica del subagente desplegado en .claude/agents/
└── tests/
    └── smoke_test.md                  1 caso positivo + 1 caso de rechazo, simulables sin obstáculos
```

## Memoria

Vive dentro del repo `forja-rayo`, no en este paquete:
`forja-rayo/.claude/agents/arquitecto-forja/memory/` (episodic.jsonl, semantic/, procedural/skills/).
Se crea sola en la primera invocación. Detalle completo en `agent.md`.
