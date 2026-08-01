# Convenciones de estructura `src/app/` (verificado 2026-07-31)

Stack real: Next.js 16.2.12 + React 19.2.4 (declarado en package.json).

Revisé `node_modules/next/dist/docs/01-app/` (getting-started + api-reference/
file-conventions) por la advertencia de AGENTS.md ("This is NOT the Next.js
you know"). Conclusión: para lo básico (page.tsx con export default,
layout.tsx raíz con html/body obligatorios, `<Link>` de next/link, Server
Components por defecto sin "use client") las convenciones documentadas
coinciden con lo esperado de App Router estándar. Única novedad notable no
crítica para este alcance: helpers globales `PageProps<'/ruta'>` /
`LayoutProps<'/ruta'>` (tipado automático de params/searchParams, generados en
`next dev`/`next build`/`next typegen`) — no obligatorio usarlos, las firmas
manuales `{ children: React.ReactNode }` siguen funcionando.

No volver a asumir ciegamente: si se tocan rutas dinámicas (`[slug]`), route
handlers, metadata avanzada, revisar la carpeta de docs correspondiente antes
de escribir código, tal como exige AGENTS.md.

## Rutas existentes tras esta invocación

- `/` → `src/app/page.tsx` (lista de cotizaciones)
- `/clientes` → `src/app/clientes/page.tsx`
- `/productos` → `src/app/productos/page.tsx`
- `/empresa` → `src/app/empresa/page.tsx`
- `/cotizaciones/nueva` → `src/app/cotizaciones/nueva/page.tsx`
- Layout raíz: `src/app/layout.tsx` (incluye `<Nav />` de `src/components/nav.tsx`)

## Patrón mobile-first usado

- Contenedor de página: `mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10` (max-w-2xl/3xl en formularios más angostos).
- Encabezados de página: stack vertical en mobile, `sm:flex-row sm:items-center sm:justify-between` para separar título de botón de acción.
- Botones de acción principal: `w-full sm:w-auto` (ancho completo en mobile).
- Tablas: el componente `Table` ya trae `overflow-x-auto` en su contenedor — no hace falta envolver de nuevo.
- Nav raíz: `overflow-x-auto` + `whitespace-nowrap` en los links para que nunca rompa el layout en viewports angostos (~375px), en vez de wrap/stack.
