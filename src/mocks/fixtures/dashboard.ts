import type { DashboardSummary } from "@/types";

export const dashboardSummaryFixture: DashboardSummary = {
  stock: {
    totalItems: 1428,
    stockValue: 28450.9,
    criticalProducts: 3,
    outOfStock: 1,
  },
  sales: {
    count: 582,
    totalAmount: 31450.9,
    totalDiscount: 1240.0,
    averageTicket: 54.04,
    grossProfit: 12082.34,
    marginPercentage: 38.4,
  },
  period: {
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    to: new Date().toISOString(),
  },
};
