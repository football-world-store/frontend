import { apiClient, API_ROUTES } from "@/services/api";
import type { ApiEnvelope, PaginatedResult } from "@/types";
import type { AuditLog, ListAuditLogsParams } from "@/types";

export const auditService = {
  list: async (
    params?: ListAuditLogsParams,
  ): Promise<PaginatedResult<AuditLog>> => {
    const { data } = await apiClient.get<
      ApiEnvelope<PaginatedResult<AuditLog>>
    >(API_ROUTES.audit.list, { params });
    return data.data;
  },
};
