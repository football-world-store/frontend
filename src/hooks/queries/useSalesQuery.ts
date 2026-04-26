import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { salesService } from "@/services";

export const useSalesQuery = () =>
  useQuery({
    queryKey: queryKeys.sales.list(),
    queryFn: salesService.list,
  });
