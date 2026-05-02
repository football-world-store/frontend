import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { dashboardService } from "@/services";

// TODO: Backend endpoint GET /dashboard/stats não está implementado ainda
// Descomente quando o backend implementar o endpoint
/*
export const useDashboardStatsQuery = () =>
  useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: dashboardService.stats,
  });
*/

// Versão mockada para desenvolvimento
export const useDashboardStatsQuery = () =>
  useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: async () => ({
      productsInStock: {
        label: "Em estoque",
        formatted: "—",
        delta: 0,
        trend: "neutral" as const,
      },
      totalRevenue: {
        label: "Receita total",
        formatted: "—",
        delta: 0,
        trend: "neutral" as const,
      },
      totalSales: {
        label: "Total de vendas",
        formatted: "—",
        delta: 0,
        trend: "neutral" as const,
      },
      averageTicket: {
        label: "Ticket médio",
        formatted: "—",
        delta: 0,
        trend: "neutral" as const,
      },
      alerts: 0,
      topClubs: [],
      sizeShares: [],
      totalProfit: 0,
      bestSellingClub: "—",
      topPerformanceSize: "—",
      revenueHistory: [],
      slowMovingItems: [],
    }),
  });
