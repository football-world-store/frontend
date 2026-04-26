import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { APP_ROUTES } from "@/constants";
import { authService } from "@/services";

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
      router.replace(APP_ROUTES.auth.signIn);
    },
  });
};
