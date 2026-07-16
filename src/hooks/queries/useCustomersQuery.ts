import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { customersService } from "@/services";
import type { ListCustomersParams } from "@/types";

export const useCustomersQuery = (params?: ListCustomersParams) =>
  useQuery({
    queryKey: queryKeys.customers.list(params),
    queryFn: () => customersService.list(params),
  });

export const useCustomerQuery = (id: string) =>
  useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: () => customersService.find(id),
    enabled: Boolean(id),
  });
