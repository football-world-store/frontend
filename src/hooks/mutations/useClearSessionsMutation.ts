import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { APP_ROUTES } from "@/constants";
import { authService } from "@/services";

export const useClearSessionsMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.clearSessions,
    onSuccess: () => {
      toast.success("Todas as sessões foram encerradas.");
      queryClient.clear();
      router.replace(APP_ROUTES.auth.signIn);
    },
  });
};
