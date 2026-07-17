export const APP_ROUTES = {
  home: "/",
  auth: {
    signIn: "/sign-in",
    register: "/register",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
  },
  app: {
    dashboard: "/dashboard",
    inventory: "/inventory",
    entries: "/entries",
    sales: "/sales",
    customers: "/customers",
    customerDetail: (id: string) => `/customers/${id}`,
    insights: "/insights",
    alerts: "/alerts",
    audit: "/audit",
    settings: "/settings",
  },
  portal: {
    root: "/portal",
    verify: "/portal/verify",
    orders: "/portal/orders",
  },
} as const;
