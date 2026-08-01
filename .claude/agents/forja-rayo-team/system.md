# system.md · Equipo forja-rayo (4 subagentes) · generado por ALAN-4AI

> Referencia rápida para el desarrollador de **forja-rayo**: generador de cotizaciones profesionales
> con IA. Stack: Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui + Supabase +
> `@react-pdf/renderer`. Hackathon "Forja", 3 días. Repo destino: `C:\Users\ANDRES\forja-rayo`.

## Visión general

4 subagentes de Claude Code, cada uno experto en una capa distinta del proyecto, coordinados sin
`Task` tool (ver `coordination_diagram.md`) mediante un archivo compartido `PLAN.md`. Todos comparten
el mismo **MVP Ledger** (ver abajo) como límite duro de alcance: cualquier pedido fuera de esa lista
se rechaza, sin importar quién lo pida ni cuántas veces se repita el pedido.

## Tabla rol / tools / model

| Agente | Rol | Tools | Model | Bash para... |
|---|---|---|---|---|
| `arquitecto-forja` | Guardián del alcance MVP · mantiene `PLAN.md` · prioriza y audita avance | Read, Write, Edit, Glob, Grep | sonnet | (sin Bash — no ejecuta comandos) |
| `frontend-forja` | UI Next.js/Tailwind/shadcn + server actions/route handlers | Read, Write, Edit, Glob, Grep, Bash | sonnet | `npx shadcn add`, `npm run dev`/`build` |
| `supabase-forja` | Esquema de datos, RLS, auth, storage del logo | Read, Write, Edit, Glob, Grep, Bash | sonnet | `supabase` CLI (migraciones, `supabase start`) |
| `pdf-forja` | Plantilla PDF de la cotización con `@react-pdf/renderer` | Read, Write, Edit, Glob, Grep | sonnet | (sin Bash — no lo necesita) |

Los 4 son Tier **Ops** (Patrón de memoria 4/5: Working + Episodic + Semantic + Procedural, sin
Identity) y fijan `model: sonnet` explícito en su frontmatter — nunca un alias `-latest`.

## MVP Ledger — alcance cerrado (idéntico en los 4 agentes)

**Dentro del MVP:**
1. Configuración de empresa (nombre, NIT/ID fiscal, dirección, teléfono, logo, datos bancarios opcionales).
2. Clientes (crear/editar/listar, datos básicos de contacto).
3. Productos/servicios (crear/editar/listar, precio unitario, si aplica IVA).
4. Crear cotización (cliente + ítems con cantidad y precio, subtotal, IVA, total).
5. Cálculo de IVA correcto y desglosado (visible por ítem y en el total).
6. PDF profesional de la cotización, descargable y compartible.
7. Historial de cotizaciones (listar, ver, volver a descargar el PDF).
8. IA únicamente para generar/mejorar el texto de "observaciones" de la cotización — nunca para
   precios, chat general, o analítica.

**Fuera de alcance (rechazo firme, sin negociar):** multi-moneda, multi-idioma, facturación
electrónica/DIAN, pagos en línea, firma digital, roles/permisos avanzados o multi-usuario, dashboard
de analítica/reportes, exportar a Excel/CSV, edición de una cotización ya enviada (se crea una nueva
versión en su lugar), integración contable, notificaciones automáticas por email/WhatsApp, múltiples
plantillas de PDF personalizables por el usuario, IA para pricing o negociación.

## Cuándo usar cada uno

- **¿No sabes qué construir primero, o si algo se sale del MVP?** → `arquitecto-forja`. No escribe
  código de producto; decide, prioriza, rechaza, y mantiene `PLAN.md`.
- **¿Necesitas una página, formulario, tabla, o la llamada de IA para "observaciones"?** →
  `frontend-forja`. No toca esquema de datos ni la plantilla PDF.
- **¿Necesitas una tabla nueva, una política RLS, auth, o el storage del logo?** → `supabase-forja`.
  No toca UI ni la plantilla PDF.
- **¿Necesitas ajustar cómo se ve o genera el PDF de la cotización?** → `pdf-forja`. No toca UI ni
  esquema de datos.

## Despliegue

Los 4 archivos `.claude/agents/<nombre>.md` ya están copiados en `C:\Users\ANDRES\forja-rayo\.claude\agents\`
— listos para usar de inmediato. Cada subcarpeta de este paquete (`arquitecto-forja/`,
`frontend-forja/`, `supabase-forja/`, `pdf-forja/`) documenta ese mismo agente para referencia y
contiene una copia idéntica en `templates/<nombre>.subagent.md` (ver `README.md` de cada uno para el
comando de copia por si necesitas re-desplegar).

## Notas de arquitectura

- Sin `Task` tool entre ellos — coordinación 100% vía `PLAN.md` (ver `coordination_diagram.md`).
- Sin frameworks externos de orquestación (LangChain/CrewAI/AutoGen).
- Ninguno hace `git add`/`commit`/`push` salvo pedido explícito del usuario en ese turno.
- Comandos de shell de una sola línea (PowerShell en Windows).
