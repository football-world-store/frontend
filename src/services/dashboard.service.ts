import { apiClient, API_ROUTES } from "@/services/api";
import type { ApiEnvelope, DashboardStats } from "@/types";

export const dashboardService = {
  stats: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get<ApiEnvelope<DashboardStats>>(
      API_ROUTES.dashboard.stats,
    );
    return data.data;
  },
};
