import type { DashboardStats } from "@/types";

const generateRevenueHistory = () => {
  const days = 30;
  const result = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const revenue =
      1000 + Math.round(Math.sin(i / 3) * 500 + Math.random() * 600);
    const cost = Math.round(revenue * 0.6);
    result.push({
      date: `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}`,
      revenue,
      cost,
    });
  }
  return result;
};

export const dashboardStatsFixture: DashboardStats = {
  totalRevenue: {
    label: "Valor investido",
    value: 28450.9,
    formatted: "R$ 284,5k",
    delta: 12,
    trend: "up",
  },
  totalSales: {
    label: "Vendas do mês",
    value: 582,
    formatted: "582",
    delta: 8,
    trend: "up",
  },
  averageTicket: {
    label: "Margem estimada",
    value: 38.4,
    formatted: "38.4%",
    delta: 2,
    trend: "up",
  },
  productsInStock: {
    label: "Total em estoque",
    value: 1428,
    formatted: "1,428",
    delta: 15,
    trend: "up",
  },
  alerts: 3,
  salesByChannel: [
    { channel: "Loja física", total: 9230.5 },
    { channel: "Instagram", total: 5890.4 },
    { channel: "WhatsApp", total: 3330.0 },
  ],
  topProducts: [
    {
      productId: "p-002",
      productName: "Camisa Flamengo Retrô 1981",
      soldQuantity: 24,
      revenue: 11016.0,
    },
    {
      productId: "p-001",
      productName: "Camisa Brasil 2026 — Home",
      soldQuantity: 18,
      revenue: 6298.2,
    },
    {
      productId: "p-004",
      productName: "Meião Corinthians Listrado",
      soldQuantity: 30,
      revenue: 1797.0,
    },
  ],
  revenueHistory: generateRevenueHistory(),
  topClubs: [
    { name: "Flamengo", units: 1158, percentage: 92 },
    { name: "Santos", units: 864, percentage: 70 },
    { name: "Palmeiras", units: 612, percentage: 52 },
    { name: "Corinthians", units: 480, percentage: 40 },
    { name: "Outros", units: 298, percentage: 24 },
  ],
  sizeShares: [
    { size: "P", percentage: 12 },
    { size: "M", percentage: 40 },
    { size: "G", percentage: 30 },
    { size: "GG", percentage: 15 },
    { size: "XG", percentage: 3 },
  ],
  bestSellingClub: "Flamengo",
  topPerformanceSize: "Large (L)",
  totalProfit: 142850.4,
  slowMovingItems: [
    {
      productId: "p-003",
      productName: "Short Palmeiras Treino",
      daysWithoutSale: 42,
      quantity: 0,
    },
    {
      productId: "p-005",
      productName: "Inter Miami Pink 24 — S",
      daysWithoutSale: 65,
      quantity: 5,
    },
    {
      productId: "p-006",
      productName: "Vintage Training Vest",
      daysWithoutSale: 88,
      quantity: 2,
    },
  ],
};
