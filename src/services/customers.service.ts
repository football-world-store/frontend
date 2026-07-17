import { apiClient, API_ROUTES, fetchPaginated } from "@/services/api";
import type { ApiEnvelope, PaginatedResult } from "@/types";
import type {
  CreateCustomerBody,
  Customer,
  CustomerPurchasesResult,
  CustomerRankingEntry,
  ListCustomersParams,
  UpdateCustomerBody,
} from "@/types";

interface CustomerApiResponse extends Omit<Customer, "phone"> {
  whatsapp: string | null;
}

const normalizeCustomer = (raw: CustomerApiResponse): Customer => {
  const { whatsapp, ...rest } = raw;
  return { ...rest, phone: whatsapp };
};

export const customersService = {
  list: async (
    params?: ListCustomersParams,
  ): Promise<PaginatedResult<Customer>> => {
    const result = await fetchPaginated<CustomerApiResponse>(
      apiClient,
      API_ROUTES.customers.list,
      params,
    );
    return { ...result, items: result.items.map(normalizeCustomer) };
  },

  find: async (id: string): Promise<Customer> => {
    const { data } = await apiClient.post<ApiEnvelope<CustomerApiResponse>>(
      API_ROUTES.customers.find,
      { id },
    );
    return normalizeCustomer(data.data);
  },

  create: async (body: CreateCustomerBody): Promise<Customer> => {
    const { data } = await apiClient.post<ApiEnvelope<CustomerApiResponse>>(
      API_ROUTES.customers.create,
      body,
    );
    return normalizeCustomer(data.data);
  },

  update: async (body: UpdateCustomerBody): Promise<Customer> => {
    const { data } = await apiClient.patch<ApiEnvelope<CustomerApiResponse>>(
      API_ROUTES.customers.update,
      body,
    );
    return normalizeCustomer(data.data);
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(API_ROUTES.customers.delete, { data: { id } });
  },

  export: async (params?: ListCustomersParams): Promise<string> => {
    const { data } = await apiClient.get<string>(API_ROUTES.customers.export, {
      params,
      responseType: "text",
    });
    return data;
  },

  purchases: async (
    id: string,
    params?: { page?: number; limit?: number },
  ): Promise<CustomerPurchasesResult> => {
    const { data } = await apiClient.get<CustomerPurchasesResult>(
      API_ROUTES.customers.purchases(id),
      { params },
    );
    return data;
  },

  rankingByAmount: async (limit?: number): Promise<CustomerRankingEntry[]> => {
    const { data } = await apiClient.get<ApiEnvelope<CustomerRankingEntry[]>>(
      API_ROUTES.customers.rankingByAmount,
      { params: { limit } },
    );
    return data.data;
  },

  rankingByPurchases: async (
    limit?: number,
  ): Promise<CustomerRankingEntry[]> => {
    const { data } = await apiClient.get<ApiEnvelope<CustomerRankingEntry[]>>(
      API_ROUTES.customers.rankingByPurchases,
      { params: { limit } },
    );
    return data.data;
  },
};
