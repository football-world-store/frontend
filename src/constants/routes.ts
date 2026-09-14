export const APP_ROUTES = {
  home: "/",
  auth: {
    signIn: "/sign-in",
    register: "/register",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  app: {
    dashboard: "/dashboard",
    inventory: "/inventory",
    entries: "/entries",
    sales: "/sales",
    customers: "/customers",
    customerDetail: (id: string) => `/customers/${id}`,
    reservations: "/reservations",
    insights: "/insights",
    alerts: "/alerts",
    audit: "/audit",
    settings: "/settings",
  },
  portal: {
    root: "/portal",
    orders: "/portal/orders",
    reservations: "/portal/reservations",
    settings: "/portal/configuracoes",
  },
} as const;
