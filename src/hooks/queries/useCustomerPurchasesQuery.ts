import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { customersService } from "@/services";

export const useCustomerPurchasesQuery = (
  id: string,
  params?: { page?: number; limit?: number },
) =>
  useQuery({
    queryKey: queryKeys.customers.purchases(id, params),
    queryFn: () => customersService.purchases(id, params),
    enabled: Boolean(id),
  });
