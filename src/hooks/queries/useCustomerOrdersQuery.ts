import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { customerAuthService } from "@/services";

export const useCustomerOrdersQuery = () =>
  useQuery({
    queryKey: queryKeys.customerAuth.orders(),
    queryFn: customerAuthService.getOrders,
    retry: false,
    refetchOnWindowFocus: false,
  });
