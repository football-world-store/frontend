import type {
  DashboardPeriod,
  DashboardTopList,
  ListAuditLogsParams,
  ListCustomersParams,
  ListProductsParams,
  ListSalesParams,
  ListStockEntriesParams,
  ListUsersParams,
} from "@/types";

export const queryKeys = {
  user: {
    all: ["user"] as const,
    me: () => [...queryKeys.user.all, "me"] as const,
  },
  products: {
    all: ["products"] as const,
    list: (params?: ListProductsParams) =>
      [...queryKeys.products.all, "list", params ?? {}] as const,
    detail: (id: string) => [...queryKeys.products.all, "detail", id] as const,
  },
  stockEntries: {
    all: ["stockEntries"] as const,
    list: (params?: ListStockEntriesParams) =>
      [...queryKeys.stockEntries.all, "list", params ?? {}] as const,
    detail: (id: string) =>
      [...queryKeys.stockEntries.all, "detail", id] as const,
  },
  sales: {
    all: ["sales"] as const,
    list: (params?: ListSalesParams) =>
      [...queryKeys.sales.all, "list", params ?? {}] as const,
    detail: (id: string) => [...queryKeys.sales.all, "detail", id] as const,
  },
  users: {
    all: ["users"] as const,
    list: (params?: ListUsersParams) =>
      [...queryKeys.users.all, "list", params ?? {}] as const,
    detail: (id: string) => [...queryKeys.users.all, "detail", id] as const,
  },
  audit: {
    all: ["audit"] as const,
    list: (params?: ListAuditLogsParams) =>
      [...queryKeys.audit.all, "list", params ?? {}] as const,
  },
  customers: {
    all: ["customers"] as const,
    list: (params?: ListCustomersParams) =>
      [...queryKeys.customers.all, "list", params ?? {}] as const,
    detail: (id: string) => [...queryKeys.customers.all, "detail", id] as const,
    purchases: (id: string, params?: { page?: number; limit?: number }) =>
      [...queryKeys.customers.all, "purchases", id, params ?? {}] as const,
    rankingByAmount: (limit?: number) =>
      [...queryKeys.customers.all, "rankingByAmount", limit ?? null] as const,
    rankingByPurchases: (limit?: number) =>
      [
        ...queryKeys.customers.all,
        "rankingByPurchases",
        limit ?? null,
      ] as const,
  },
  alerts: {
    all: ["alerts"] as const,
    list: () => [...queryKeys.alerts.all, "list"] as const,
    count: () => [...queryKeys.alerts.all, "count"] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
    summary: (params?: DashboardPeriod) =>
      [...queryKeys.dashboard.all, "summary", params ?? {}] as const,
    topProducts: (params?: DashboardTopList) =>
      [...queryKeys.dashboard.all, "topProducts", params ?? {}] as const,
    topClubs: (params?: DashboardTopList) =>
      [...queryKeys.dashboard.all, "topClubs", params ?? {}] as const,
    sizes: (params?: DashboardPeriod) =>
      [...queryKeys.dashboard.all, "sizes", params ?? {}] as const,
    channels: (params?: DashboardPeriod) =>
      [...queryKeys.dashboard.all, "channels", params ?? {}] as const,
    margins: (params?: DashboardPeriod) =>
      [...queryKeys.dashboard.all, "margins", params ?? {}] as const,
    idleProducts: (days?: number) =>
      [...queryKeys.dashboard.all, "idleProducts", days ?? 30] as const,
    paymentMethods: (params?: DashboardPeriod) =>
      [...queryKeys.dashboard.all, "paymentMethods", params ?? {}] as const,
    stockVelocity: () => [...queryKeys.dashboard.all, "stockVelocity"] as const,
    reorderList: () => [...queryKeys.dashboard.all, "reorderList"] as const,
    capitalByClub: () => [...queryKeys.dashboard.all, "capitalByClub"] as const,
  },
} as const;
