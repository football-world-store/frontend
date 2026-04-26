import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { customersService } from "@/services";

export const useCustomersQuery = () =>
  useQuery({
    queryKey: queryKeys.customers.list(),
    queryFn: customersService.list,
  });

export const useCustomerQuery = (id: string) =>
  useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: () => customersService.byId(id),
    enabled: Boolean(id),
  });
