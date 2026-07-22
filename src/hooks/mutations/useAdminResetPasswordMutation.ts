import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { usersService } from "@/services";

export const useAdminResetPasswordMutation = () =>
  useMutation({
    mutationFn: ({ id, newPassword }: { id: string; newPassword: string }) =>
      usersService.adminResetPassword(id, newPassword),
    onSuccess: () => toast.success("Senha redefinida com sucesso."),
  });
