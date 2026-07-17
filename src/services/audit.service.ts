import { apiClient, API_ROUTES, fetchPaginated } from "@/services/api";
import type { PaginatedResult } from "@/types";
import type { AuditLog, ListAuditLogsParams } from "@/types";

export const auditService = {
  list: async (
    params?: ListAuditLogsParams,
  ): Promise<PaginatedResult<AuditLog>> =>
    fetchPaginated<AuditLog>(apiClient, API_ROUTES.audit.list, params),
};
