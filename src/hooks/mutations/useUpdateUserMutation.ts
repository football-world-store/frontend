import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/constants";
import { usersService } from "@/services";
import type { SystemUser } from "@/types";

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.update,
    onSuccess: (user: SystemUser) => {
      toast.success("Usuário atualizado.");
      queryClient.setQueryData(queryKeys.users.detail(user.id), user);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};
