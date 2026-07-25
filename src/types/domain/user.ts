import type { ListQueryParams } from "@/types/api/common";
import type { UserRole } from "@/types/api/auth";

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserBody {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterUserBody {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserBody {
  id: string;
  name?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface ListUsersParams extends ListQueryParams {
  role?: UserRole;
  isActive?: boolean;
}

export interface LastSession {
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "SALE"
  | "ENTRY"
  | "CANCEL"
  | "LOGIN"
  | "LOGOUT";

export interface AuditLogUser {
  id: string;
  name: string;
  email: string;
}

/**
 * Shape confirmado contra
 * backend/src/modules/audit/use-case/list-audit-logs.use-case.ts —
 * inclui `user: { id, name, email }` aninhado (via Prisma include), não um
 * `userName` solto. GET /audit devolve { data, meta } SEM o envelope
 * { data: {...} } padrão dos demais endpoints (o controller repassa o
 * retorno do use-case direto).
 */
export interface AuditLog {
  id: string;
  userId: string;
  action: AuditAction;
  entity: string;
  entityId: string | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  user: AuditLogUser;
  createdAt: string;
}

export interface ListAuditLogsParams extends ListQueryParams {
  userId?: string;
  action?: AuditAction;
  entity?: string;
  startDate?: string;
  endDate?: string;
}
