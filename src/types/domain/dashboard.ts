export type DashboardPeriodKind =
  | "TODAY"
  | "LAST_7_DAYS"
  | "LAST_30_DAYS"
  | "CURRENT_MONTH"
  | "CUSTOM";

export interface DashboardPeriod {
  period: DashboardPeriodKind;
  startDate?: string;
  endDate?: string;
}

export interface DashboardTopList extends DashboardPeriod {
  limit?: number;
}

export interface DashboardPeriodMeta {
  from: string;
  to: string;
}

export interface DashboardStockSnapshot {
  totalItems: number;
  stockValue: number;
  criticalProducts: number;
  outOfStock: number;
}

export interface DashboardSalesSummary {
  count: number;
  totalAmount: number;
  totalDiscount: number;
  averageTicket: number;
  grossProfit: number;
  marginPercentage: number;
}

export interface DashboardSummary {
  stock: DashboardStockSnapshot;
  sales: DashboardSalesSummary;
  period: DashboardPeriodMeta;
}

export interface DashboardTopProduct {
  id: string;
  internalCode: string;
  name: string;
  clubOrBrand: string;
  category: string;
  size: string;
  totalSold: number;
  totalRevenue: number;
}

export interface DashboardTopClub {
  clubOrBrand: string;
  totalSold: number;
  totalRevenue: number;
  uniqueProducts: number;
}

export interface DashboardSizeRanking {
  size: string;
  totalSold: number;
  totalRevenue: number;
}

export interface DashboardSizes {
  top5: DashboardSizeRanking[];
  bottom5: DashboardSizeRanking[];
}

export interface DashboardChannel {
  channel: string;
  saleCount: number;
  totalAmount: number;
  percentage: number;
}

export interface DashboardMarginsOverall {
  revenue: number;
  cost: number;
  grossProfit: number;
  marginPercentage: number;
}

export interface DashboardMarginByProduct {
  id: string;
  internalCode: string;
  name: string;
  totalSold: number;
  revenue: number;
  cost: number;
  profit: number;
  marginPercentage: number;
}

export interface DashboardMargins {
  overall: DashboardMarginsOverall;
  byProduct: DashboardMarginByProduct[];
}

export interface DashboardIdleProduct {
  id: string;
  internalCode: string;
  name: string;
  clubOrBrand: string;
  size: string;
  quantity: number;
  costPrice: number;
  stuckValue: number;
  lastSaleAt: string | null;
  daysIdle: number | null;
}

export interface DashboardPaymentMethod {
  method: string;
  saleCount: number;
  totalAmount: number;
  percentage: number;
}

export interface DashboardReorderItem {
  id: string;
  internalCode: string;
  name: string;
  clubOrBrand: string;
  category: string;
  size: string;
  currentStock: number;
  minStock: number;
  deficit: number;
  costPrice: number;
  reorderCost: number;
}

export interface DashboardCapitalByClub {
  clubOrBrand: string;
  productVariants: number;
  totalStock: number;
  totalCapital: number;
  capitalPercentage: number;
  criticalVariants: number;
}

export type DashboardStockVelocityRisk = "CRITICAL" | "WARNING" | "OK";

export interface DashboardStockVelocityItem {
  id: string;
  internalCode: string;
  name: string;
  clubOrBrand: string;
  size: string;
  currentStock: number;
  minStock: number;
  soldLast30d: number;
  avgDailySales: number;
  daysUntilStockout: number | null;
  risk: DashboardStockVelocityRisk;
}
