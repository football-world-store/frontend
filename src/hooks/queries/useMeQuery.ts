import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { authService } from "@/services";

export const useMeQuery = () =>
  useQuery({
    queryKey: queryKeys.user.me(),
    queryFn: authService.me,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
