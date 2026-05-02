import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/constants";
import { salesService } from "@/services";

export const useCreateSaleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: salesService.create,
    onSuccess: () => {
      toast.success("Venda registrada.");
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
};
