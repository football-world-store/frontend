export const API_ROUTES = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    me: "/auth/me",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  products: {
    list: "/products",
    byId: (id: string) => `/products/${id}`,
  },
  stockEntries: {
    list: "/stock-entries",
  },
  sales: {
    list: "/sales",
  },
  customers: {
    list: "/customers",
    byId: (id: string) => `/customers/${id}`,
  },
  alerts: {
    list: "/alerts",
  },
  users: {
    list: "/users",
  },
  dashboard: {
    stats: "/dashboard/stats",
  },
} as const;
