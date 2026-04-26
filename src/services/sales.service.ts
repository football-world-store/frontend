import { apiClient, API_ROUTES } from "@/services/api";
import type { ApiEnvelope, Sale } from "@/types";

export const salesService = {
  list: async (): Promise<Sale[]> => {
    const { data } = await apiClient.get<ApiEnvelope<Sale[]>>(
      API_ROUTES.sales.list,
    );
    return data.data;
  },
};
