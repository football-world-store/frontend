import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import { APP_ROUTES, queryKeys } from "@/constants";
import { authService } from "@/services";

const REDIRECT_PARAM = "redirect";

const isSafeRedirectPath = (path: string | null): path is string => {
  return Boolean(path && path.startsWith("/") && !path.startsWith("//"));
};

const getLoginTarget = (role: string, redirectTo: string | null): string => {
  if (role === "CUSTOMER") return APP_ROUTES.portal.orders;
  if (isSafeRedirectPath(redirectTo)) return redirectTo;
  return APP_ROUTES.app.dashboard;
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.user.me(), user);
      if (user.role === "CUSTOMER") {
        queryClient.setQueryData(queryKeys.customerAuth.identity(), {
          id: user.id,
          name: user.name,
          email: user.email,
        });
      }

      const redirectTo = searchParams.get(REDIRECT_PARAM);
      // Customer sessions use a separate cookie and cannot access staff routes.
      // Always keep them in the portal, even when sign-in was reached with a
      // redirect query from a protected staff page.
      router.replace(getLoginTarget(user.role, redirectTo));
    },
  });
};
