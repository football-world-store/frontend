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
    reservations: "/reservations",
    insights: "/insights",
    alerts: "/alerts",
    audit: "/audit",
    settings: "/settings",
  },
  portal: {
    root: "/portal",
    // Path fixo no backend (request-magic-link.use-case.ts monta
    // `${FRONTEND_URL}/minha-conta/entrar?token=...`), não uma env var —
    // o e-mail já sai apontando para cá, então o front tem que bater.
    verify: "/minha-conta/entrar",
    orders: "/portal/orders",
  },
} as const;
