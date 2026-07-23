import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { APP_ROUTES } from "@/constants";
import { usersService } from "@/services";

export const useChangePasswordMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: usersService.changePassword,
    onSuccess: () => {
      toast.success("Senha alterada com sucesso. Faça login novamente.");
      queryClient.clear();
      router.replace(APP_ROUTES.auth.signIn);
    },
  });
};
