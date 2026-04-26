import { apiClient, API_ROUTES } from "@/services/api";
import type { ApiEnvelope, SystemUser } from "@/types";
import type { UserFormValues } from "@/lib/validations";

export const usersService = {
  list: async (): Promise<SystemUser[]> => {
    const { data } = await apiClient.get<ApiEnvelope<SystemUser[]>>(
      API_ROUTES.users.list,
    );
    return data.data;
  },
  create: async (body: UserFormValues): Promise<SystemUser> => {
    const { data } = await apiClient.post<ApiEnvelope<SystemUser>>(
      API_ROUTES.users.list,
      body,
    );
    return data.data;
  },
};
