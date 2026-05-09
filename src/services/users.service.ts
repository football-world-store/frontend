import { apiClient, API_ROUTES } from "@/services/api";
import type {
  ApiEnvelope,
  AuthUser,
  ChangePasswordRequest,
  PaginatedResult,
} from "@/types";
import type {
  AuditLog,
  CreateUserBody,
  ListAuditLogsParams,
  ListUsersParams,
  SystemUser,
  UpdateUserBody,
} from "@/types";

export const usersService = {
  me: async (): Promise<AuthUser> => {
    const { data } = await apiClient.get<ApiEnvelope<AuthUser>>(
      API_ROUTES.users.me,
    );
    return data.data;
  },

  changePassword: async (body: ChangePasswordRequest): Promise<void> => {
    await apiClient.patch(API_ROUTES.users.changePassword, body);
  },

  list: async (
    params?: ListUsersParams,
  ): Promise<PaginatedResult<SystemUser>> => {
    const { data } = await apiClient.get<
      ApiEnvelope<PaginatedResult<SystemUser>>
    >(API_ROUTES.users.list, { params });
    return data.data;
  },

  create: async (body: CreateUserBody): Promise<SystemUser> => {
    const { data } = await apiClient.post<ApiEnvelope<SystemUser>>(
      API_ROUTES.users.create,
      body,
    );
    return data.data;
  },

  find: async (id: string): Promise<SystemUser> => {
    const { data } = await apiClient.post<ApiEnvelope<SystemUser>>(
      API_ROUTES.users.find,
      { id },
    );
    return data.data;
  },

  update: async (body: UpdateUserBody): Promise<SystemUser> => {
    const { data } = await apiClient.patch<ApiEnvelope<SystemUser>>(
      API_ROUTES.users.update,
      body,
    );
    return data.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(API_ROUTES.users.delete, { data: { id } });
  },

  audit: async (
    params?: ListAuditLogsParams,
  ): Promise<PaginatedResult<AuditLog>> => {
    const { data } = await apiClient.get<
      ApiEnvelope<PaginatedResult<AuditLog>>
    >(API_ROUTES.users.audit, { params });
    return data.data;
  },
};
