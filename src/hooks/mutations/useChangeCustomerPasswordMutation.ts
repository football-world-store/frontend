import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { customerAuthService } from "@/services";

export const useChangeCustomerPasswordMutation = () =>
  useMutation({
    mutationFn: customerAuthService.changePassword,
    onSuccess: () => {
      toast.success("Senha alterada com sucesso.");
    },
  });
