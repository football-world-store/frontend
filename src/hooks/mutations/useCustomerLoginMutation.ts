import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { APP_ROUTES, queryKeys } from "@/constants";
import { customerAuthService } from "@/services";
import type { CustomerIdentity, CustomerLoginBody } from "@/types";

type Options = Pick<
  UseMutationOptions<CustomerIdentity, Error, CustomerLoginBody>,
  "onError" | "onSuccess"
>;

export const useCustomerLoginMutation = (options?: Options) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: customerAuthService.login,
    onSuccess: (identity, vars, ctx, mutation) => {
      queryClient.setQueryData(queryKeys.customerAuth.identity(), identity);
      router.replace(APP_ROUTES.portal.orders);
      options?.onSuccess?.(identity, vars, ctx, mutation);
    },
    onError: (err, vars, ctx, mutation) => {
      options?.onError?.(err, vars, ctx, mutation);
    },
  });
};
