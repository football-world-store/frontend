import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { stockEntriesService } from "@/services";

export const useStockEntriesQuery = () =>
  useQuery({
    queryKey: queryKeys.stockEntries.list(),
    queryFn: stockEntriesService.list,
  });
