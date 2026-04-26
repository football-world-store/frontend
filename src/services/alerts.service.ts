import { apiClient, API_ROUTES } from "@/services/api";
import type { Alert, ApiEnvelope } from "@/types";

export const alertsService = {
  list: async (): Promise<Alert[]> => {
    const { data } = await apiClient.get<ApiEnvelope<Alert[]>>(
      API_ROUTES.alerts.list,
    );
    return data.data;
  },
};
