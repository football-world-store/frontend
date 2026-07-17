import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { customerAuthService } from "@/services";

export const useRequestMagicLinkMutation = () =>
  useMutation({
    mutationFn: customerAuthService.requestMagicLink,
    onSuccess: () => {
      toast.success(
        "Se o email existir em nossa base, enviamos um link de acesso.",
      );
    },
  });
