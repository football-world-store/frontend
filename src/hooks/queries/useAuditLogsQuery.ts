import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { auditService } from "@/services";
import type { ListAuditLogsParams } from "@/types";

interface UseAuditLogsOptions {
  enabled?: boolean;
}

export const useAuditLogsQuery = (
  params?: ListAuditLogsParams,
  options?: UseAuditLogsOptions,
) =>
  useQuery({
    queryKey: queryKeys.audit.list(params),
    queryFn: () => auditService.list(params),
    enabled: options?.enabled ?? true,
  });
