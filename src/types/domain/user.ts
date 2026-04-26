import type { UserRole } from "@/types/api/auth";

export type SystemUserRole = UserRole;

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: SystemUserRole;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}
