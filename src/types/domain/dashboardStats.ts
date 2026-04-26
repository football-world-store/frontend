export interface DashboardStat {
  label: string;
  value: number;
  formatted: string;
  delta: number;
  trend: "up" | "down" | "flat";
}

export interface RevenuePoint {
  date: string;
  revenue: number;
  cost: number;
}

export interface ClubPerformance {
  name: string;
  units: number;
  percentage: number;
}

export interface SizeShare {
  size: string;
  percentage: number;
}

export interface DashboardStats {
  totalRevenue: DashboardStat;
  totalSales: DashboardStat;
  averageTicket: DashboardStat;
  productsInStock: DashboardStat;
  alerts: number;
  salesByChannel: { channel: string; total: number }[];
  topProducts: {
    productId: string;
    productName: string;
    soldQuantity: number;
    revenue: number;
  }[];
  revenueHistory: RevenuePoint[];
  topClubs: ClubPerformance[];
  sizeShares: SizeShare[];
  bestSellingClub: string;
  topPerformanceSize: string;
  totalProfit: number;
  slowMovingItems: {
    productId: string;
    productName: string;
    daysWithoutSale: number;
    quantity: number;
  }[];
}
