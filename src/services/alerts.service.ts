import { apiClient, API_ROUTES } from "@/services/api";
import type { Alert, AlertCount, ApiEnvelope, ResolveAlertBody } from "@/types";

export const alertsService = {
  list: async (): Promise<Alert[]> => {
    const { data } = await apiClient.get<ApiEnvelope<Alert[]>>(
      API_ROUTES.alerts.list,
    );
    return data.data;
  },

  count: async (): Promise<AlertCount> => {
    const { data } = await apiClient.get<ApiEnvelope<AlertCount>>(
      API_ROUTES.alerts.count,
    );
    return data.data;
  },

  resolve: async ({ id, note }: ResolveAlertBody): Promise<Alert> => {
    const { data } = await apiClient.patch<ApiEnvelope<Alert>>(
      API_ROUTES.alerts.resolve(id),
      { note },
    );
    return data.data;
  },
};
