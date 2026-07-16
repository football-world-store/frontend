import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/constants";
import { customersService } from "@/services";

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
