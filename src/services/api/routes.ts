export const API_ROUTES = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    clearSessions: "/auth/clear-sessions",
  },
  users: {
    me: "/users/me",
    changePassword: "/users/me/password",
    list: "/users",
    create: "/users",
    find: "/users/find",
    update: "/users",
    delete: "/users",
    audit: "/users/audit",
  },
  products: {
    list: "/products",
    create: "/products",
    find: "/products/find",
    update: "/products",
    delete: "/products",
    restore: "/products/restore",
    photo: "/products/photo",
    photoUploadUrl: "/products/photo/upload-url",
  },
  stockEntries: {
    list: "/stock-entries",
    create: "/stock-entries",
    find: "/stock-entries/find",
    reverse: "/stock-entries/reverse",
  },
  sales: {
    list: "/sales",
    create: "/sales",
    find: "/sales/find",
    cancel: "/sales/cancel",
  },

  customers: {
    list: "/customers",
    byId: (id: string) => `/customers/${id}`,
  },
  alerts: {
    list: "/alerts",
    count: "/alerts/count",
    resolve: (id: string) => `/alerts/${id}/resolve`,
  },
  dashboard: {
    stats: "/dashboard/stats",
  },
} as const;
