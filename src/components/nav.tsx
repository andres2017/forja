"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Cotizaciones" },
  { href: "/clientes", label: "Clientes" },
  { href: "/productos", label: "Productos" },
  { href: "/empresa", label: "Empresa" },
];

export function Nav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/90 shadow-sm backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto px-4 py-3 sm:gap-1.5 sm:px-6">
        <Link
          href="/"
          className="mr-3 flex shrink-0 items-center gap-2 sm:mr-5"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm">
            ⚡
          </span>
          <span className="text-sm font-bold tracking-tight text-foreground">
            Forja Rayo
          </span>
        </Link>

        {links.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                active
                  ? "shrink-0 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-semibold whitespace-nowrap text-primary"
                  : "shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              }
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
