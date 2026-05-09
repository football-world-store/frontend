import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { usersService } from "@/services";
import type { ListUsersParams } from "@/types";

export const useUsersQuery = (params?: ListUsersParams) =>
  useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => usersService.list(params),
  });
