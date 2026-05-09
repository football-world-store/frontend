import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { stockEntriesService } from "@/services";
import type { ListStockEntriesParams } from "@/types";

export const useStockEntriesQuery = (params?: ListStockEntriesParams) =>
  useQuery({
    queryKey: queryKeys.stockEntries.list(params),
    queryFn: () => stockEntriesService.list(params),
  });

export const useStockEntryQuery = (id: string) =>
  useQuery({
    queryKey: queryKeys.stockEntries.detail(id),
    queryFn: () => stockEntriesService.find(id),
    enabled: Boolean(id),
  });
