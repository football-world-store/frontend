import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { APP_ROUTES } from "@/constants";
import { usersService } from "@/services";

export const useRegisterUserMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: usersService.register,
    onSuccess: () => {
      toast.success(
        "Cadastro enviado! Aguarde a aprovação de um administrador.",
      );
      router.replace(APP_ROUTES.auth.signIn);
    },
  });
};
