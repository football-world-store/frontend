import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/constants";
import { productsService } from "@/services";

export const useDeleteProductPhotoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsService.deletePhoto,
    onSuccess: () => {
      toast.success("Foto removida.");
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
};
