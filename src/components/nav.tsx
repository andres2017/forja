import Link from "next/link";

const links = [
  { href: "/", label: "Cotizaciones" },
  { href: "/clientes", label: "Clientes" },
  { href: "/productos", label: "Productos" },
  { href: "/empresa", label: "Empresa" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 shadow-sm backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto px-4 py-3 sm:gap-2 sm:px-6">
        <span className="mr-2 shrink-0 text-sm font-semibold whitespace-nowrap text-foreground sm:mr-4">
          Forja Rayo
        </span>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
