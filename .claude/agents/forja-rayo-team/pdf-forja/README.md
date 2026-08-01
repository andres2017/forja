# pdf-forja

Subagente de Claude Code · Tier Ops · especialista `@react-pdf/renderer` del proyecto **forja-rayo**
(generador de cotizaciones profesionales con IA, hackathon "Forja" de 3 días).

## Qué hace

Crea/ajusta la plantilla de PDF de la cotización: encabezado con logo y datos de empresa, datos del
cliente, tabla de ítems, subtotal/IVA/total correctamente calculados y visibles, pie con
observaciones generadas por IA si existen. Enfoque en que el PDF se vea premium pero sea liviano y
legible en preview de WhatsApp. No decide el modelo de datos ni construye la UI de la app.

## Cómo desplegarlo

Ya está desplegado en `C:\Users\ANDRES\forja-rayo\.claude\agents\pdf-forja.md`. Si necesitas volver
a copiarlo, ejecuta en PowerShell:

```powershell
Copy-Item "C:\Users\ANDRES\ALAN-4AI_v1.0_alumnos_2026-07-24\ALAN-4AI\output\forja-rayo-team\pdf-forja\templates\pdf-forja.subagent.md" -Destination "C:\Users\ANDRES\forja-rayo\.claude\agents\pdf-forja.md" -Force
```

Claude Code detecta subagentes en `.claude/agents/*.md` dentro del repo destino automáticamente —
no hace falta reiniciar la sesión, solo abrir/continuar Claude Code dentro de `forja-rayo`.

## Ejemplos de invocación

```
# Auto-delegación (Claude Code decide solo, por la description del subagente)
"Crea la plantilla PDF de la cotización con logo, cliente, ítems y totales"
"Reduce el peso del logo en el PDF generado para que se vea bien en WhatsApp"

# Invocación explícita
"Usa el subagente pdf-forja para agregar el pie de observaciones al PDF"
```

## Ejemplos de rechazo firme

- **"Deja que el usuario elija entre 3 plantillas de PDF distintas."** → Rechazado: múltiples
  plantillas personalizables por el usuario están fuera del MVP Ledger.
- **"Agrega un botón para exportar la cotización también a Excel/CSV."** → Rechazado: exportar a
  Excel/CSV está fuera del MVP Ledger.

## Estructura de este paquete

```
pdf-forja/
├── CLAUDE.md                  Filosofía, restricciones, 13 anti-patterns adaptados
├── agent.md                   Invocación, pipeline de 5 fases, contrato de output, memoria
├── README.md                  Este archivo
├── templates/
│   └── pdf-forja.subagent.md  Copia idéntica del subagente desplegado en .claude/agents/
└── tests/
    └── smoke_test.md          1 caso positivo + 1 caso de rechazo, simulables sin obstáculos
```

## Memoria

Vive dentro del repo `forja-rayo`, no en este paquete:
`forja-rayo/.claude/agents/pdf-forja/memory/` (episodic.jsonl, semantic/, procedural/skills/). Se
crea sola en la primera invocación. Detalle completo en `agent.md`.
