import { apiClient, API_ROUTES } from "@/services/api";
import type {
  ApiEnvelope,
  AuthUser,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponseData,
  ResetPasswordRequest,
} from "@/types";

export const authService = {
  login: async (body: LoginRequest): Promise<AuthUser> => {
    const { data } = await apiClient.post<ApiEnvelope<LoginResponseData>>(
      API_ROUTES.auth.login,
      body,
    );
    return data.data.user;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(API_ROUTES.auth.logout);
  },

  me: async (): Promise<AuthUser> => {
    const { data } = await apiClient.get<ApiEnvelope<AuthUser>>(
      API_ROUTES.auth.me,
    );
    return data.data;
  },

  forgotPassword: async (body: ForgotPasswordRequest): Promise<void> => {
    await apiClient.post(API_ROUTES.auth.forgotPassword, body);
  },

  resetPassword: async (body: ResetPasswordRequest): Promise<void> => {
    await apiClient.post(API_ROUTES.auth.resetPassword, body);
  },
};
