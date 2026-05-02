import { apiClient, API_ROUTES } from "@/services/api";
import type { ApiEnvelope, PaginatedResult } from "@/types";
import type {
  CreateStockEntryBody,
  ListStockEntriesParams,
  ReverseStockEntryBody,
  StockEntry,
} from "@/types";

export const stockEntriesService = {
  list: async (
    params?: ListStockEntriesParams,
  ): Promise<PaginatedResult<StockEntry>> => {
    const { data } = await apiClient.get<
      ApiEnvelope<PaginatedResult<StockEntry>>
    >(API_ROUTES.stockEntries.list, { params });
    return data.data;
  },

  create: async (body: CreateStockEntryBody): Promise<StockEntry> => {
    const { data } = await apiClient.post<ApiEnvelope<StockEntry>>(
      API_ROUTES.stockEntries.create,
      body,
    );
    return data.data;
  },

  find: async (id: string): Promise<StockEntry> => {
    const { data } = await apiClient.post<ApiEnvelope<StockEntry>>(
      API_ROUTES.stockEntries.find,
      { id },
    );
    return data.data;
  },

  reverse: async (body: ReverseStockEntryBody): Promise<StockEntry> => {
    const { data } = await apiClient.post<ApiEnvelope<StockEntry>>(
      API_ROUTES.stockEntries.reverse,
      body,
    );
    return data.data;
  },
};
