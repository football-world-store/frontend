import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { customerAuthService } from "@/services";

export const useCustomerProfileQuery = () =>
  useQuery({
    queryKey: queryKeys.customerAuth.profile(),
    queryFn: customerAuthService.getProfile,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
