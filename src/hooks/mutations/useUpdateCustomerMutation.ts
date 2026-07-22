import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/constants";
import { customersService } from "@/services";

export const useUpdateCustomerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: customersService.update,
    onSuccess: (customer, variables) => {
      const msg =
        variables.isActive === true
          ? "Cliente aprovado com sucesso."
          : "Cliente atualizado com sucesso.";
      toast.success(msg);
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      queryClient.setQueryData(
        queryKeys.customers.detail(customer.id),
        customer,
      );
    },
  });
};
