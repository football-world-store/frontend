import { apiClient, API_ROUTES, fetchPaginated } from "@/services/api";
import type {
  ApiEnvelope,
  AuthUser,
  ChangePasswordRequest,
  PaginatedResult,
} from "@/types";
import type {
  CreateUserBody,
  ListUsersParams,
  RegisterUserBody,
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

  register: async (body: RegisterUserBody): Promise<void> => {
    await apiClient.post(API_ROUTES.users.register, body);
  },

  changePassword: async (body: ChangePasswordRequest): Promise<void> => {
    await apiClient.patch(API_ROUTES.users.changePassword, body);
  },

  list: async (
    params?: ListUsersParams,
  ): Promise<PaginatedResult<SystemUser>> =>
    fetchPaginated<SystemUser>(apiClient, API_ROUTES.users.list, params),

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

  adminResetPassword: async (
    id: string,
    newPassword: string,
  ): Promise<void> => {
    await apiClient.patch(API_ROUTES.users.adminResetPassword, {
      id,
      newPassword,
    });
  },
};
