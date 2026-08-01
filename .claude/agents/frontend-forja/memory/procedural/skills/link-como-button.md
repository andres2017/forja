# Skill: enlazar una ruta usando el estilo de Button (base-ui, no Radix)

Cuando se necesite que un botón navegue a otra ruta (ej. "Nueva cotización" →
`/cotizaciones/nueva`), NO envolver `<Link><Button>...</Button></Link>`
(anida `<button>` dentro de `<a>`). En este proyecto (base-ui) se usa la prop
`render`:

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

<Button render={<Link href="/cotizaciones/nueva" />}>
  Nueva cotización
</Button>
```

Para botones sin destino aún (placeholders sin lógica de datos, ej. "Nuevo
cliente" cuando no existe la página `/clientes/nuevo`), usar `disabled` en vez
de un `href` inventado o un `onClick` vacío — comunica claramente que aún no
está conectado, sin inventar rutas fuera del pedido explícito.
