import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/constants";
import { salesService } from "@/services";

export const useCancelSaleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: salesService.cancel,
    onSuccess: () => {
      toast.success("Venda cancelada.");
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
};
