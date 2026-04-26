import { apiClient, API_ROUTES } from "@/services/api";
import type { ApiEnvelope, Customer } from "@/types";
import type { CustomerFormValues } from "@/lib/validations";

export const customersService = {
  list: async (): Promise<Customer[]> => {
    const { data } = await apiClient.get<ApiEnvelope<Customer[]>>(
      API_ROUTES.customers.list,
    );
    return data.data;
  },
  byId: async (id: string): Promise<Customer> => {
    const { data } = await apiClient.get<ApiEnvelope<Customer>>(
      API_ROUTES.customers.byId(id),
    );
    return data.data;
  },
  create: async (body: CustomerFormValues): Promise<Customer> => {
    const { data } = await apiClient.post<ApiEnvelope<Customer>>(
      API_ROUTES.customers.list,
      body,
    );
    return data.data;
  },
};
