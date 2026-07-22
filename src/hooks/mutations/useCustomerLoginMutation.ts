import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { APP_ROUTES, queryKeys } from "@/constants";
import { customerAuthService } from "@/services";

export const useCustomerLoginMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: customerAuthService.login,
    onSuccess: (identity) => {
      queryClient.setQueryData(queryKeys.customerAuth.identity(), identity);
      router.replace(APP_ROUTES.portal.orders);
    },
  });
};
