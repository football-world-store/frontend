import { APP_ROUTES } from "@/constants";

export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: APP_ROUTES.app.dashboard, label: "Dashboard", icon: "dashboard" },
  {
    href: APP_ROUTES.app.inventory,
    label: "Inventário",
    icon: "inventory_2",
  },
  {
    href: APP_ROUTES.app.entries,
    label: "Entradas e saídas",
    icon: "swap_horiz",
  },
  { href: APP_ROUTES.app.customers, label: "Clientes", icon: "groups" },
  { href: APP_ROUTES.app.insights, label: "Insights", icon: "analytics" },
  { href: APP_ROUTES.app.settings, label: "Configurações", icon: "settings" },
];
