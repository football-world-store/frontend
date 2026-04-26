import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { productsService } from "@/services";

export const useProductsQuery = () => {
  return useQuery({
    queryKey: queryKeys.products.list(),
    queryFn: productsService.list,
  });
};

export const useProductQuery = (id: string) => {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsService.byId(id),
    enabled: Boolean(id),
  });
};
