import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/constants";
import { usersService } from "@/services";

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.remove,
    onSuccess: () => {
      toast.success("Usuário removido.");
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};
