import type {
  DashboardClubTrend,
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

export const clubTrendFixture: DashboardClubTrend[] = [
  {
    clubOrBrand: "Flamengo",
    points: [
      { month: CLUB_TREND_MONTHS[0], totalSold: 18, totalRevenue: 2340.0 },
      { month: CLUB_TREND_MONTHS[1], totalSold: 22, totalRevenue: 2860.0 },
      { month: CLUB_TREND_MONTHS[2], totalSold: 31, totalRevenue: 4030.0 },
      { month: CLUB_TREND_MONTHS[3], totalSold: 27, totalRevenue: 3510.0 },
      { month: CLUB_TREND_MONTHS[4], totalSold: 35, totalRevenue: 4550.0 },
      { month: CLUB_TREND_MONTHS[5], totalSold: 42, totalRevenue: 5460.0 },
    ],
  },
  {
    clubOrBrand: "Corinthians",
    points: [
      { month: CLUB_TREND_MONTHS[0], totalSold: 14, totalRevenue: 1820.0 },
      { month: CLUB_TREND_MONTHS[1], totalSold: 16, totalRevenue: 2080.0 },
      { month: CLUB_TREND_MONTHS[2], totalSold: 15, totalRevenue: 1950.0 },
      { month: CLUB_TREND_MONTHS[3], totalSold: 19, totalRevenue: 2470.0 },
      { month: CLUB_TREND_MONTHS[4], totalSold: 21, totalRevenue: 2730.0 },
      { month: CLUB_TREND_MONTHS[5], totalSold: 18, totalRevenue: 2340.0 },
    ],
  },
  {
    clubOrBrand: "Seleção Brasileira",
    points: [
      { month: CLUB_TREND_MONTHS[0], totalSold: 9, totalRevenue: 1350.0 },
      { month: CLUB_TREND_MONTHS[1], totalSold: 11, totalRevenue: 1650.0 },
      { month: CLUB_TREND_MONTHS[2], totalSold: 13, totalRevenue: 1950.0 },
      { month: CLUB_TREND_MONTHS[3], totalSold: 24, totalRevenue: 3600.0 },
      { month: CLUB_TREND_MONTHS[4], totalSold: 19, totalRevenue: 2850.0 },
      { month: CLUB_TREND_MONTHS[5], totalSold: 16, totalRevenue: 2400.0 },
    ],
  },
];

export const customersByTeamFixture: DashboardCustomersByTeam[] = [
  {
    favoriteTeam: "Flamengo",
    customerCount: 42,
    totalSpent: 18450.0,
    averageTicket: 87.14,
    purchaseCount: 212,
  },
  {
    favoriteTeam: "Corinthians",
    customerCount: 28,
    totalSpent: 9870.0,
    averageTicket: 65.8,
    purchaseCount: 150,
  },
  {
    favoriteTeam: "Seleção Brasileira",
    customerCount: 19,
    totalSpent: 7120.0,
    averageTicket: 79.1,
    purchaseCount: 90,
  },
];

export const reservationConversionFixture: DashboardReservationConversion = {
  confirmed: 34,
  cancelled: 9,
  expired: 5,
  conversionRate: 70.8,
};
