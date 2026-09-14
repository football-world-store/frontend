"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { Icon, Logo } from "@/components/atoms";
import { APP_ROUTES } from "@/constants";
import { useCustomerLogoutMutation } from "@/hooks/mutations";
import { useCustomerProfileQuery } from "@/hooks/queries";

interface PortalNavItem {
  href: string;
  icon: string;
  label: string;
}

const PORTAL_NAV_ITEMS: PortalNavItem[] = [
  {
    href: APP_ROUTES.portal.orders,
    icon: "receipt_long",
    label: "Meus pedidos",
  },
  {
    href: APP_ROUTES.portal.reservations,
    icon: "event_available",
    label: "Minhas reservas",
  },
  {
    href: APP_ROUTES.portal.settings,
    icon: "settings",
    label: "Configurações",
  },
];

const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

interface SidebarLinkProps {
  item: PortalNavItem;
  isActive: boolean;
}

const SidebarLink = ({ item, isActive }: SidebarLinkProps) => (
  <Link
    href={item.href}
    aria-current={isActive ? "page" : undefined}
    className={
      isActive
        ? "flex items-center gap-3 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary shadow-sm"
        : "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
    }
  >
    <Icon name={item.icon} size="sm" /> {item.label}
  </Link>
);

interface BottomNavLinkProps {
  item: PortalNavItem;
  isActive: boolean;
  compactLabel: string;
}

const BottomNavLink = ({
  item,
  isActive,
  compactLabel,
}: BottomNavLinkProps) => (
  <Link
    href={item.href}
    aria-current={isActive ? "page" : undefined}
    className={
      isActive
        ? "flex flex-col items-center gap-1 rounded-xl bg-primary px-5 py-2 text-on-primary"
        : "flex flex-col items-center gap-1 rounded-xl px-5 py-2 text-on-surface-variant"
    }
  >
    <Icon name={item.icon} size="sm" />
    <span className="font-label text-[0.6rem] font-semibold uppercase tracking-wider">
      {compactLabel}
    </span>
  </Link>
);

const BOTTOM_NAV_LABELS: Record<string, string> = {
  [APP_ROUTES.portal.orders]: "Pedidos",
  [APP_ROUTES.portal.reservations]: "Reservas",
  [APP_ROUTES.portal.settings]: "Ajustes",
};

interface PortalShellProps {
  active: string;
  eyebrow: string;
  title: ReactNode;
  description: string;
  children: ReactNode;
}

export const PortalShell = ({
  active,
  eyebrow,
  title,
  description,
  children,
}: PortalShellProps) => {
  const logoutMutation = useCustomerLogoutMutation();
  const { data: profile } = useCustomerProfileQuery();
  const name = profile?.name ?? "Cliente";
  const email = profile?.email;
  const initials = getInitials(name);

  return (
    <main className="min-h-screen bg-surface font-body text-on-surface lg:flex">
      <aside className="hidden w-72 shrink-0 flex-col border-r border-outline-variant bg-surface-container-low px-6 py-8 lg:flex">
        <Link href={APP_ROUTES.portal.root} className="mb-12 flex items-center">
          <Logo size="md" className="h-16 w-44" />
        </Link>
        <nav aria-label="Navegação do portal" className="space-y-2">
          {PORTAL_NAV_ITEMS.map((item) => (
            <SidebarLink
              key={item.href}
              item={item}
              isActive={item.href === active}
            />
          ))}
        </nav>
        <div className="mt-auto space-y-4">
          <div className="flex items-center gap-3 rounded-2xl bg-surface-container p-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-metallic font-headline text-sm font-bold text-on-primary">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="truncate text-xs text-on-surface-variant">
                {email ?? "Acompanhe seus pedidos"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-on-surface-variant transition-colors hover:bg-error-container hover:text-on-error-container disabled:opacity-50"
          >
            <Icon name="logout" size="sm" />{" "}
            {logoutMutation.isPending ? "Saindo..." : "Sair"}
          </button>
        </div>
      </aside>
      <section className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-8 sm:pt-10 lg:px-12 lg:pb-12">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 font-label text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {eyebrow}
              </p>
              <h1 className="font-headline text-3xl font-extrabold tracking-[-0.05em] sm:text-4xl">
                {title}
              </h1>
              <p className="mt-2 text-sm text-on-surface-variant">
                {description}
              </p>
            </div>
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-metallic font-headline font-bold text-on-primary lg:hidden">
              {initials}
            </span>
          </header>
          {children}
        </div>
      </section>
      <nav
        aria-label="Navegação rápida"
        className="fixed inset-x-4 bottom-4 z-10 flex justify-around rounded-2xl border border-outline-variant bg-surface-container-high/95 p-2 shadow-ambient backdrop-blur lg:hidden"
      >
        {PORTAL_NAV_ITEMS.map((item) => (
          <BottomNavLink
            key={item.href}
            item={item}
            isActive={item.href === active}
            compactLabel={BOTTOM_NAV_LABELS[item.href]}
          />
        ))}
        <button
          type="button"
          onClick={() => logoutMutation.mutate()}
          className="flex flex-col items-center gap-1 rounded-xl px-5 py-2 text-on-surface-variant"
        >
          <Icon name="logout" size="sm" />
          <span className="font-label text-[0.6rem] font-semibold uppercase tracking-wider">
            Sair
          </span>
        </button>
      </nav>
    </main>
  );
};
