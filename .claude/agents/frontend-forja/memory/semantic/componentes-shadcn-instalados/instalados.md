# Componentes shadcn/ui instalados (última verificación con Glob 2026-07-31)

Ubicación: `src/components/ui/`

- button.tsx
- card.tsx
- checkbox.tsx (instalado 2026-07-31 vía `npx shadcn add checkbox` para el
  campo booleano `lleva_iva` de Productos; envuelve `@base-ui/react/checkbox`)
- dialog.tsx
- input.tsx
- label.tsx
- select.tsx
- separator.tsx
- table.tsx
- textarea.tsx

Reverificar con Glob antes de asumir que algo más existe o falta.

## Checkbox (base-ui) en formularios con FormData

`Checkbox` (base-ui) renderiza un `<input>` oculto junto al control visual y
soporta `name`, `defaultChecked`, `value`/`uncheckedValue` — igual que un
checkbox nativo, un checkbox sin marcar NO envía ningún valor en el
`FormData` (a menos que se pase `uncheckedValue`). Patrón usado en
`src/app/productos/nuevo-producto-dialog.tsx` + `actions.ts`:

```tsx
<Checkbox id="lleva_iva" name="lleva_iva" defaultChecked />
```

```ts
lleva_iva: formData.get("lleva_iva") !== null, // presente = true, ausente = false
```

Confirmado leyendo `node_modules/@base-ui/react/checkbox/root/CheckboxRoot.d.ts`.

## Detalle importante: este proyecto usa `@base-ui/react`, NO Radix

`components.json` → `"style": "base-nova"`. Los primitivos (`Button`, `Input`,
`Select`, `Separator`) envuelven `@base-ui/react/*`, no `@radix-ui/*`.

Consecuencia práctica: no existe prop `asChild` (patrón Radix). Para que un
`Button` (o cualquier primitivo base-ui) renderice como otro elemento (p. ej.
un `<Link>` de next/link en vez de `<button>`), se usa la prop `render` con un
`ReactElement`:

```tsx
<Button render={<Link href="/ruta" />}>Texto</Button>
```

Esto evita anidar `<button>` dentro de `<a>`. Confirmado leyendo
`node_modules/@base-ui/react/internals/types.d.ts` (prop `render?: React.ReactElement | ComponentRenderFn`)
y `node_modules/@base-ui/react/button/Button.d.ts`.

`Select` (base-ui) sí soporta `disabled` en el `Select.Root` — verificado en
`node_modules/@base-ui/react/select/root/SelectRoot.d.ts`.

## Select (base-ui) controlado con datos reales (confirmado 2026-07-31)

`Select` es `SelectPrimitive.Root`, genérico (`SelectRoot<Value, Multiple>`).
Para un select controlado con datos que vienen de Supabase (ej. elegir un
cliente o un producto por `id`):

```tsx
const [clienteId, setClienteId] = useState<string | null>(null);

<Select value={clienteId} onValueChange={setClienteId}>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Selecciona un cliente" />
  </SelectTrigger>
  <SelectContent>
    {clientes.map((c) => (
      <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>
    ))}
  </SelectContent>
</Select>
```

- El estado de "nada seleccionado" se representa con `null` (no con `""`),
  porque `value`/`defaultValue`/`onValueChange` en `SelectRoot.Props` están
  tipados como `Value | null | undefined` — no hace falta un `SelectItem`
  placeholder con `value=""` para esto; con `value={null}` y `SelectValue
  placeholder="..."` alcanza. Confirmado en
  `node_modules/@base-ui/react/select/root/SelectRoot.d.ts` y
  `.../select/value/SelectValue.d.ts`.
- `SelectItem`'s `value` prop está tipado como `any` (no hereda el genérico
  `Value` del Root), así que TypeScript infiere el `Value` del Root
  únicamente desde los props puestos directamente en `<Select>` (`value`,
  `onValueChange`, `defaultValue`, `items`). En la práctica, con
  `value={clienteId}` (tipo `string | null`) alcanza para que TS infiera
  `Value = string` sin anotar el genérico a mano en el JSX — verificado
  porque `npm run build` compiló sin errores de tipos.
- Si la lista puede venir vacía (sin clientes/productos aún), renderizar un
  `SelectItem` con `disabled` y un value dummy propio (ej.
  `value="sin-clientes"`) en vez de dejar `SelectContent` vacío, para dar
  feedback ("No hay clientes aún") sin romper el tipo del Select.

Ejemplo completo de uso en tabla con filas dinámicas (un `Select` por fila,
cada uno con su propio estado dentro de un array):
`src/app/cotizaciones/nueva/nueva-cotizacion-form.tsx`.

## Alias del proyecto (components.json)

- `@/components` , `@/components/ui`, `@/lib`, `@/lib/utils`, `@/hooks`

## Componentes app-específicos (no shadcn puro)

- `src/components/nav.tsx` — nav horizontal raíz (server component, sin "use client", solo usa `next/link`).
