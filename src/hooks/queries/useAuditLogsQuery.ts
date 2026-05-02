import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { usersService } from "@/services";
import type { ListAuditLogsParams } from "@/types";

interface UseAuditLogsOptions {
  enabled?: boolean;
}

export const useAuditLogsQuery = (
  params?: ListAuditLogsParams,
  options?: UseAuditLogsOptions,
) =>
  useQuery({
    queryKey: queryKeys.users.audit(params),
    queryFn: () => usersService.audit(params),
    enabled: options?.enabled ?? true,
  });
