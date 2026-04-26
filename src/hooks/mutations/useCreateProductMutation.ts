import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/constants";
import { productsService } from "@/services";

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productsService.create,
    onSuccess: () => {
      toast.success("Produto cadastrado com sucesso.");
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
};
