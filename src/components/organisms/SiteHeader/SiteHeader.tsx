import Link from "next/link";

import { Logo } from "@/components/atoms";
import { APP_ROUTES } from "@/constants";

const NAV_LINKS = [
  { href: "#produtos", label: "Produtos" },
  { href: "#acai", label: "Açaí" },
  { href: "#loja-fisica", label: "Loja física" },
];

export const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        <Link
          href={APP_ROUTES.publicHome}
          className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          aria-label="Football World Store — início"
        >
          <Logo variant="compact" size="sm" />
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden sm:flex items-center gap-6"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-label text-on-surface-variant text-sm hover:text-on-surface transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={APP_ROUTES.auth.signIn}
            className="hidden sm:inline-flex items-center justify-center h-10 px-4 rounded-xl border-ghost text-on-surface font-label font-medium uppercase tracking-wide text-xs sm:text-sm transition-colors duration-200 hover:bg-surface-container-highest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Sou Cliente VIP
          </Link>
          <a
            href="https://footballworld.store"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-10 px-5 rounded-xl bg-primary text-on-primary font-label font-medium uppercase tracking-wide text-xs sm:text-sm transition-all duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Ver Loja
          </a>
        </div>
      </div>
    </header>
  );
};
