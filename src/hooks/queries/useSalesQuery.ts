import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { salesService } from "@/services";
import type { ListSalesParams } from "@/types";

export const useSalesQuery = (params?: ListSalesParams) =>
  useQuery({
    queryKey: queryKeys.sales.list(params),
    queryFn: () => salesService.list(params),
  });

export const useSaleQuery = (id: string) =>
  useQuery({
    queryKey: queryKeys.sales.detail(id),
    queryFn: () => salesService.find(id),
    enabled: Boolean(id),
  });
