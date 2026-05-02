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

export interface UpdateUserBody {
  id: string;
  name?: string;
  email?: string;
  role?: UserRole;
}

export interface ListUsersParams extends ListQueryParams {
  role?: UserRole;
  isActive?: boolean;
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

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: AuditAction;
  entity: string;
  entityId: string | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface ListAuditLogsParams extends ListQueryParams {
  userId?: string;
  action?: AuditAction;
  entity?: string;
  startDate?: string;
  endDate?: string;
}
