import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import { APP_ROUTES, queryKeys } from "@/constants";
import { authService } from "@/services";

const REDIRECT_PARAM = "redirect";

const isSafeRedirectPath = (path: string | null): path is string => {
  return Boolean(path && path.startsWith("/") && !path.startsWith("//"));
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.user.me(), user);

      const redirectTo = searchParams.get(REDIRECT_PARAM);
      const target = isSafeRedirectPath(redirectTo)
        ? redirectTo
        : APP_ROUTES.app.dashboard;
      router.replace(target);
    },
  });
};
