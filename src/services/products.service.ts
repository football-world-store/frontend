import { apiClient, API_ROUTES } from "@/services/api";
import type { Product } from "@/types";

export const productsService = {
  list: async (): Promise<Product[]> => {
    const { data } = await apiClient.get<Product[]>(API_ROUTES.products.list);
    return data;
  },

  byId: async (id: string): Promise<Product> => {
    const { data } = await apiClient.get<Product>(API_ROUTES.products.byId(id));
    return data;
  },
};
