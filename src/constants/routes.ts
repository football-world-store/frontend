export const APP_ROUTES = {
  home: "/",
  auth: {
    signIn: "/sign-in",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
  },
  app: {
    dashboard: "/dashboard",
    inventory: "/inventory",
    entries: "/entries",
    customers: "/customers",
    customerDetail: (id: string) => `/customers/${id}`,
    insights: "/insights",
    settings: "/settings",
  },
} as const;
