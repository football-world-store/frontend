import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/constants";
import { stockEntriesService } from "@/services";

export const useReverseStockEntryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: stockEntriesService.reverse,
    onSuccess: () => {
      toast.success("Movimentação estornada.");
      queryClient.invalidateQueries({ queryKey: queryKeys.stockEntries.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
};
