import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/constants";
import { customersService } from "@/services";

export const useUpdateCustomerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: customersService.update,
    onSuccess: (customer) => {
      toast.success("Cliente atualizado com sucesso.");
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      queryClient.setQueryData(
        queryKeys.customers.detail(customer.id),
        customer,
      );
    },
  });
};
