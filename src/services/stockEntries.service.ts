import { apiClient, API_ROUTES } from "@/services/api";
import type { ApiEnvelope, StockEntry } from "@/types";
import type { StockEntryFormValues } from "@/lib/validations";

export const stockEntriesService = {
  list: async (): Promise<StockEntry[]> => {
    const { data } = await apiClient.get<ApiEnvelope<StockEntry[]>>(
      API_ROUTES.stockEntries.list,
    );
    return data.data;
  },
  create: async (body: StockEntryFormValues): Promise<StockEntry> => {
    const { data } = await apiClient.post<ApiEnvelope<StockEntry>>(
      API_ROUTES.stockEntries.list,
      body,
    );
    return data.data;
  },
};
