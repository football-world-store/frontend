import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { productsService } from "@/services";
import type { ListProductsParams } from "@/types";

export const useProductsQuery = (params?: ListProductsParams) =>
  useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productsService.list(params),
  });

export const useProductQuery = (id: string) =>
  useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsService.find(id),
    enabled: Boolean(id),
  });
