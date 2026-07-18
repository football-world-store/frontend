import { APP_ROUTES } from "@/constants";

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  /** Item de destaque no BottomNav mobile — o restante vai para o drawer "Mais". */
  primaryOnMobile?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: APP_ROUTES.app.dashboard,
    label: "Dashboard",
    icon: "dashboard",
    primaryOnMobile: true,
  },
  {
    href: APP_ROUTES.app.inventory,
    label: "Inventário",
    icon: "inventory_2",
    primaryOnMobile: true,
  },
  {
    href: APP_ROUTES.app.entries,
    label: "Entradas e saídas",
    icon: "swap_horiz",
  },
  {
    href: APP_ROUTES.app.sales,
    label: "Vendas",
    icon: "point_of_sale",
    primaryOnMobile: true,
  },
  {
    href: APP_ROUTES.app.customers,
    label: "Clientes",
    icon: "groups",
    primaryOnMobile: true,
  },
  { href: APP_ROUTES.app.insights, label: "Insights", icon: "analytics" },
  {
    href: APP_ROUTES.app.alerts,
    label: "Alertas",
    icon: "notifications_active",
  },
  { href: APP_ROUTES.app.audit, label: "Auditoria", icon: "history" },
  { href: APP_ROUTES.app.settings, label: "Configurações", icon: "settings" },
];
