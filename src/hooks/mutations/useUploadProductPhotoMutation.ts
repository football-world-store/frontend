import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/constants";
import { productsService } from "@/services";

export const useUploadProductPhotoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsService.uploadPhoto,
    onSuccess: () => {
      toast.success("Foto atualizada.");
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
};
