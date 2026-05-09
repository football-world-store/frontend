import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/constants";
import { productsService } from "@/services";
import type { Product } from "@/types";

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsService.update,
    onSuccess: (product: Product) => {
      toast.success("Produto atualizado.");
      queryClient.setQueryData(queryKeys.products.detail(product.id), product);
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
};
