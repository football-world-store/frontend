import type {
  ListAuditLogsParams,
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
    audit: (params?: ListAuditLogsParams) =>
      [...queryKeys.users.all, "audit", params ?? {}] as const,
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
  dashboard: {
    all: ["dashboard"] as const,
    stats: () => [...queryKeys.dashboard.all, "stats"] as const,
  },
} as const;
