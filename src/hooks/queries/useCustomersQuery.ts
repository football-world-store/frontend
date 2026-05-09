import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import type { Customer } from "@/types";

interface CustomersListResult {
  items: Customer[];
  total: number;
}

const EMPTY_LIST: CustomersListResult = { items: [], total: 0 };

// O backend ainda não expõe endpoints de clientes (GET /customers,
// GET /customers/:id, POST /customers). Quando estiverem disponíveis,
// trocar a queryFn por `customersService.list()` e `customersService.byId(id)`.
export const useCustomersQuery = () =>
  useQuery({
    queryKey: queryKeys.customers.list(),
    queryFn: async (): Promise<CustomersListResult> => EMPTY_LIST,
    staleTime: Infinity,
  });

export const useCustomerQuery = (id: string) =>
  useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: async (): Promise<Customer | null> => null,
    enabled: Boolean(id),
    staleTime: Infinity,
  });
