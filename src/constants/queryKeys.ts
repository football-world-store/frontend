export const queryKeys = {
  user: {
    all: ["user"] as const,
    me: () => [...queryKeys.user.all, "me"] as const,
  },
  products: {
    all: ["products"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.products.all, "list", filters ?? {}] as const,
    detail: (id: string) => [...queryKeys.products.all, "detail", id] as const,
  },
  stockEntries: {
    all: ["stockEntries"] as const,
    list: () => [...queryKeys.stockEntries.all, "list"] as const,
  },
  sales: {
    all: ["sales"] as const,
    list: () => [...queryKeys.sales.all, "list"] as const,
  },
  customers: {
    all: ["customers"] as const,
    list: () => [...queryKeys.customers.all, "list"] as const,
    detail: (id: string) => [...queryKeys.customers.all, "detail", id] as const,
  },
  alerts: {
    all: ["alerts"] as const,
    list: () => [...queryKeys.alerts.all, "list"] as const,
  },
  users: {
    all: ["users"] as const,
    list: () => [...queryKeys.users.all, "list"] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
    stats: () => [...queryKeys.dashboard.all, "stats"] as const,
  },
} as const;
