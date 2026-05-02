import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

import {
  APP_ROUTES,
  ENV,
  FALLBACK_ERROR_MESSAGE,
  HTTP_CONTENT_TYPE,
  HTTP_HEADER,
  HTTP_STATUS,
  REQUEST_TIMEOUT_MS,
} from "@/constants";
import type { ApiErrorResponse } from "@/types";

const REFRESH_PATH = "/auth/refresh";
const SILENT_ERROR_PATHS = ["/users/me"] as const;
const REFRESH_BLOCKLIST = [
  "/auth/login",
  "/auth/refresh",
  "/auth/forgot-password",
  "/auth/reset-password",
] as const;
const PUBLIC_AUTH_ROUTES = [
  APP_ROUTES.auth.signIn,
  APP_ROUTES.auth.forgotPassword,
  APP_ROUTES.auth.resetPassword,
] as const;

type RetryableConfig = InternalAxiosRequestConfig & { __retried?: boolean };

export const apiClient = axios.create({
  baseURL: ENV.API_URL,
  headers: { [HTTP_HEADER.contentType]: HTTP_CONTENT_TYPE.json },
  timeout: REQUEST_TIMEOUT_MS,
  withCredentials: true,
});

const isBrowser = (): boolean => typeof window !== "undefined";

const matchesPath = (
  url: string | undefined,
  paths: readonly string[],
): boolean => {
  const target = url ?? "";
  return paths.some((path) => target.includes(path));
};

const isSilentRequest = (error: AxiosError<ApiErrorResponse>): boolean =>
  matchesPath(error.config?.url, SILENT_ERROR_PATHS);

const isOnPublicAuthRoute = (): boolean => {
  if (!isBrowser()) return false;
  const { pathname } = window.location;
  return PUBLIC_AUTH_ROUTES.some((route) => pathname.startsWith(route));
};

const extractErrorMessage = (error: AxiosError<ApiErrorResponse>): string =>
  error.response?.data?.message ?? error.message ?? FALLBACK_ERROR_MESSAGE;

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

const shouldAttemptRefresh = (error: AxiosError): boolean => {
  const config = error.config as RetryableConfig | undefined;
  if (!config || config.__retried) return false;
  return !matchesPath(config.url, REFRESH_BLOCKLIST);
};

let refreshInFlight: Promise<void> | null = null;

const performRefresh = (): Promise<void> => {
  if (!refreshInFlight) {
    refreshInFlight = apiClient
      .post(REFRESH_PATH)
      .then(() => undefined)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
};

const retryWithRefresh = async (error: AxiosError): Promise<unknown> => {
  const config = error.config as RetryableConfig;
  config.__retried = true;
  await performRefresh();
  return apiClient.request(config);
};

const handleResponseError = async (error: AxiosError<ApiErrorResponse>) => {
  if (error.response?.status !== HTTP_STATUS.unauthorized) {
    showErrorToast(error);
    return Promise.reject(error);
  }

  if (shouldAttemptRefresh(error)) {
    try {
      return await retryWithRefresh(error);
    } catch {
      handleUnauthorized(error);
      showErrorToast(error);
      return Promise.reject(error);
    }
  }

  handleUnauthorized(error);
  showErrorToast(error);
  return Promise.reject(error);
};

apiClient.interceptors.response.use(
  (response) => response,
  handleResponseError,
);
