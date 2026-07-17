import type {
  DashboardClubTrendEntry,
  DashboardCustomersByTeam,
  DashboardReservationConversion,
  DashboardSummary,
} from "@/types";

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

const CLUB_TREND_MONTHS = [
  "2026-02",
  "2026-03",
  "2026-04",
  "2026-05",
  "2026-06",
  "2026-07",
];

const clubTrendEntries = (
  clubOrBrand: string,
  totalSoldByMonth: number[],
  revenueByMonth: number[],
): DashboardClubTrendEntry[] =>
  CLUB_TREND_MONTHS.map((month, index) => ({
    clubOrBrand,
    month,
    totalSold: totalSoldByMonth[index],
    totalRevenue: revenueByMonth[index],
  }));

export const clubTrendFixture: DashboardClubTrendEntry[] = [
  ...clubTrendEntries(
    "Flamengo",
    [18, 22, 31, 27, 35, 42],
    [2340.0, 2860.0, 4030.0, 3510.0, 4550.0, 5460.0],
  ),
  ...clubTrendEntries(
    "Corinthians",
    [14, 16, 15, 19, 21, 18],
    [1820.0, 2080.0, 1950.0, 2470.0, 2730.0, 2340.0],
  ),
  ...clubTrendEntries(
    "Seleção Brasileira",
    [9, 11, 13, 24, 19, 16],
    [1350.0, 1650.0, 1950.0, 3600.0, 2850.0, 2400.0],
  ),
];

export const customersByTeamFixture: DashboardCustomersByTeam[] = [
  {
    favoriteTeam: "Flamengo",
    customerCount: 42,
    totalSpent: 18450.0,
    averageSpent: 87.14,
    totalPurchases: 212,
  },
  {
    favoriteTeam: "Corinthians",
    customerCount: 28,
    totalSpent: 9870.0,
    averageSpent: 65.8,
    totalPurchases: 150,
  },
  {
    favoriteTeam: "Seleção Brasileira",
    customerCount: 19,
    totalSpent: 7120.0,
    averageSpent: 79.1,
    totalPurchases: 90,
  },
];

export const reservationConversionFixture: DashboardReservationConversion = {
  total: 53,
  pendingCount: 5,
  conversionRate: 70.83,
  byStatus: [
    { status: "CONFIRMED", count: 34, percentage: 64.15 },
    { status: "CANCELLED", count: 9, percentage: 16.98 },
    { status: "EXPIRED", count: 5, percentage: 9.43 },
    { status: "PENDING", count: 5, percentage: 9.43 },
  ],
};
