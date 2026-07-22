import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants";
import { productsService } from "@/services";

export const useDistinctProductValuesQuery = () =>
  useQuery({
    queryKey: queryKeys.products.distinctValues,
    queryFn: productsService.distinctValues,
    staleTime: 5 * 60 * 1000,
  });
