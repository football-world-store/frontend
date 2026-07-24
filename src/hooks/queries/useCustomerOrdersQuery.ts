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

export const useCustomerOrderQuery = (id: string) =>
  useQuery({
    queryKey: queryKeys.customerAuth.orderDetail(id),
    queryFn: () => customerAuthService.getOrderById(id),
    enabled: Boolean(id),
    retry: false,
    refetchOnWindowFocus: false,
  });
