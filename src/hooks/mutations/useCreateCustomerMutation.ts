import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/constants";
import { customersService } from "@/services";

// TODO: Backend endpoint POST /customers não está implementado ainda
// Descomente quando o backend implementar o endpoint
/*
export const useCreateCustomerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: customersService.create,
    onSuccess: () => {
      toast.success("Cliente cadastrado com sucesso.");
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });
};
*/

// Versão mockada para desenvolvimento
export const useCreateCustomerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      toast.info(
        "Endpoint de criação de clientes ainda não foi implementado no backend.",
      );
      return {};
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });
};
