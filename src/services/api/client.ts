import axios, { AxiosError } from "axios";
import { toast } from "sonner";

import { APP_ROUTES } from "@/constants";
import type { ApiErrorResponse } from "@/types";

import { API_BASE_URL, DEFAULT_HEADERS, REQUEST_TIMEOUT_MS } from "./config";

const UNAUTHORIZED_STATUS = 401;
const SILENT_ERROR_PATHS = ["/auth/me"] as const;
const PUBLIC_AUTH_ROUTES = [
  APP_ROUTES.auth.signIn,
  APP_ROUTES.auth.forgotPassword,
  APP_ROUTES.auth.resetPassword,
] as const;
const FALLBACK_ERROR_MESSAGE = "Algo deu errado. Tente novamente.";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: DEFAULT_HEADERS,
  timeout: REQUEST_TIMEOUT_MS,
  withCredentials: true,
});

const isBrowser = (): boolean => typeof window !== "undefined";

const isSilentRequest = (error: AxiosError<ApiErrorResponse>): boolean => {
  const path = error.config?.url ?? "";
  return SILENT_ERROR_PATHS.some((silent) => path.includes(silent));
};

const isOnPublicAuthRoute = (): boolean => {
  if (!isBrowser()) return false;
  const { pathname } = window.location;
  return PUBLIC_AUTH_ROUTES.some((route) => pathname.startsWith(route));
};

const extractErrorMessage = (error: AxiosError<ApiErrorResponse>): string => {
  return (
    error.response?.data?.message ?? error.message ?? FALLBACK_ERROR_MESSAGE
  );
};

const redirectToSignIn = (): void => {
  window.location.replace(APP_ROUTES.auth.signIn);
};

const handleUnauthorized = (error: AxiosError<ApiErrorResponse>): void => {
  if (!isBrowser()) return;
  if (isOnPublicAuthRoute()) return;
  if (isSilentRequest(error)) return;
  redirectToSignIn();
};

const showErrorToast = (error: AxiosError<ApiErrorResponse>): void => {
  if (!isBrowser()) return;
  if (isSilentRequest(error)) return;
  toast.error(extractErrorMessage(error));
};

const handleResponseError = (error: AxiosError<ApiErrorResponse>) => {
  if (error.response?.status === UNAUTHORIZED_STATUS) {
    handleUnauthorized(error);
  }
  showErrorToast(error);
  return Promise.reject(error);
};

apiClient.interceptors.response.use(
  (response) => response,
  handleResponseError,
);
