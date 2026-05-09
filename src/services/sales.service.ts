import { apiClient, API_ROUTES } from "@/services/api";
import type { ApiEnvelope, PaginatedResult } from "@/types";
import type {
  CancelSaleBody,
  CreateSaleBody,
  ListSalesParams,
  Sale,
} from "@/types";

export const salesService = {
  list: async (params?: ListSalesParams): Promise<PaginatedResult<Sale>> => {
    const { data } = await apiClient.get<ApiEnvelope<PaginatedResult<Sale>>>(
      API_ROUTES.sales.list,
      { params },
    );
    return data.data;
  },

  create: async (body: CreateSaleBody): Promise<Sale> => {
    const { data } = await apiClient.post<ApiEnvelope<Sale>>(
      API_ROUTES.sales.create,
      body,
    );
    return data.data;
  },

  find: async (id: string): Promise<Sale> => {
    const { data } = await apiClient.post<ApiEnvelope<Sale>>(
      API_ROUTES.sales.find,
      { id },
    );
    return data.data;
  },

  cancel: async (body: CancelSaleBody): Promise<Sale> => {
    const { data } = await apiClient.post<ApiEnvelope<Sale>>(
      API_ROUTES.sales.cancel,
      body,
    );
    return data.data;
  },
};
