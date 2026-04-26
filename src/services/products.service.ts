import { apiClient, API_ROUTES } from "@/services/api";
import type { ApiEnvelope, Product } from "@/types";
import type { ProductFormValues } from "@/lib/validations";

export const productsService = {
  list: async (): Promise<Product[]> => {
    const { data } = await apiClient.get<ApiEnvelope<Product[]>>(
      API_ROUTES.products.list,
    );
    return data.data;
  },
  byId: async (id: string): Promise<Product> => {
    const { data } = await apiClient.get<ApiEnvelope<Product>>(
      API_ROUTES.products.byId(id),
    );
    return data.data;
  },
  create: async (body: ProductFormValues): Promise<Product> => {
    const { data } = await apiClient.post<ApiEnvelope<Product>>(
      API_ROUTES.products.list,
      body,
    );
    return data.data;
  },
};
