"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icon, IconButton, Logo } from "@/components/atoms";
import { APP_ROUTES } from "@/constants";
import { useUI } from "@/contexts";

interface SidebarItem {
  href: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: SidebarItem[] = [
  { href: APP_ROUTES.app.dashboard, label: "Dashboard", icon: "dashboard" },
  { href: APP_ROUTES.app.inventory, label: "Inventário", icon: "inventory_2" },
  {
    href: APP_ROUTES.app.entries,
    label: "Entradas e saídas",
    icon: "swap_horiz",
  },
  { href: APP_ROUTES.app.customers, label: "Clientes", icon: "groups" },
  { href: APP_ROUTES.app.insights, label: "Insights", icon: "analytics" },
  { href: APP_ROUTES.app.settings, label: "Configurações", icon: "settings" },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar } = useUI();

  return (
    <>
      {/* Overlay mobile */}
      {isSidebarOpen ? (
        <div
          className="fixed inset-0 z-40 bg-surface/60 backdrop-blur-sm lg:hidden"
          onClick={closeSidebar}
          aria-hidden
        />
      ) : null}

      <aside
        className={[
          "w-64 bg-surface-container-low h-screen fixed left-0 top-0 z-50 flex flex-col py-6 transition-transform duration-200",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="px-6 mb-8 flex items-center justify-between">
          <Logo size="sm" variant="compact" />
          <IconButton
            iconName="close"
            label="Fechar menu"
            className="lg:hidden"
            onClick={closeSidebar}
          />
        </div>
        <nav className="flex-1 flex flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-headline font-bold tracking-tight uppercase text-sm transition-colors focus-visible:outline-none focus-visible:ring-focus-gold",
                  isActive
                    ? "bg-surface-container-highest text-primary"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                ].join(" ")}
              >
                <Icon name={item.icon} filled={isActive} size="md" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
