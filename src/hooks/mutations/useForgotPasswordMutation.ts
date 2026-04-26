import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { authService } from "@/services";

export const useForgotPasswordMutation = () =>
  useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: () => {
      toast.success(
        "Se o email existir, instruções de recuperação foram enviadas.",
      );
    },
  });
