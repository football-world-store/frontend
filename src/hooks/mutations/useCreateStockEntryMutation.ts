import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/constants";
import { stockEntriesService } from "@/services";

export const useCreateStockEntryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: stockEntriesService.create,
    onSuccess: () => {
      toast.success("Movimentação registrada.");
      queryClient.invalidateQueries({ queryKey: queryKeys.stockEntries.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
};
