import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { customersService } from "@/services";

export const useCustomerRankingByAmountQuery = (limit?: number) =>
  useQuery({
    queryKey: queryKeys.customers.rankingByAmount(limit),
    queryFn: () => customersService.rankingByAmount(limit),
  });
