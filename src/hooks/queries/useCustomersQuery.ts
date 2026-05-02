import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { customersService } from "@/services";

// TODO: Backend endpoints GET /customers e GET /customers/:id não estão implementados ainda
// Descomente quando o backend implementar os endpoints
/*
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
*/

// Versões mockadas para desenvolvimento
export const useCustomersQuery = () =>
  useQuery({
    queryKey: queryKeys.customers.list(),
    queryFn: async () => ({
      items: [],
      total: 0,
    }),
  });

export const useCustomerQuery = (id: string) =>
  useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: async () => ({}),
    enabled: Boolean(id),
  });
