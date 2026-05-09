import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { usersService } from "@/services";

export const useChangePasswordMutation = () =>
  useMutation({
    mutationFn: usersService.changePassword,
    onSuccess: () => {
      toast.success("Senha alterada com sucesso. Faça login novamente.");
    },
  });
