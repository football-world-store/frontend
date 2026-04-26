import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { usersService } from "@/services";

export const useUsersQuery = () =>
  useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: usersService.list,
  });
