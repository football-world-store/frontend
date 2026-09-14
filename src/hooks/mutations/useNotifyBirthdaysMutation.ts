import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/constants";
import { customersService } from "@/services";

export const useNotifyBirthdaysMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customersService.notifyBirthdays,
    onSuccess: (result) => {
      if (result.notified === 0) {
        toast.info(
          "Nenhum email enviado — sem aniversariantes com email hoje.",
        );
      } else {
        toast.success(`${result.notified} email(s) de aniversário enviado(s).`);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });
};
