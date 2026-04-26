import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { APP_ROUTES } from "@/constants";
import { authService } from "@/services";

export const useResetPasswordMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      toast.success("Senha redefinida com sucesso. Faça login novamente.");
      router.replace(APP_ROUTES.auth.signIn);
    },
  });
};
