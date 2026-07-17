import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { APP_ROUTES, queryKeys } from "@/constants";
import { customerAuthService } from "@/services";

export const useCustomerLogoutMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: customerAuthService.logout,
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.customerAuth.identity(), null);
      queryClient.removeQueries({ queryKey: queryKeys.customerAuth.orders() });
      router.replace(APP_ROUTES.portal.root);
    },
  });
};
