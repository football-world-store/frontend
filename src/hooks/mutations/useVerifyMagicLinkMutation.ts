import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { APP_ROUTES, queryKeys } from "@/constants";
import { customerAuthService } from "@/services";

export const useVerifyMagicLinkMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: customerAuthService.verify,
    onSuccess: (identity) => {
      queryClient.setQueryData(queryKeys.customerAuth.identity(), identity);
      router.replace(APP_ROUTES.portal.orders);
    },
  });
};
