import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { usersService } from "@/services";

export const useMeQuery = () =>
  useQuery({
    queryKey: queryKeys.user.me(),
    queryFn: usersService.me,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

export const useLastSessionQuery = () =>
  useQuery({
    queryKey: queryKeys.user.lastSession(),
    queryFn: usersService.lastSession,
    retry: false,
  });
