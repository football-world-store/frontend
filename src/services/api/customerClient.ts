import axios, { type AxiosError } from "axios";
import { toast } from "sonner";

import {
  ENV,
  FALLBACK_ERROR_MESSAGE,
  HTTP_CONTENT_TYPE,
  HTTP_HEADER,
  HTTP_STATUS,
  REQUEST_TIMEOUT_MS,
} from "@/constants";
import type { ApiErrorResponse } from "@/types";

const SILENT_ERROR_PATHS = ["/customer-auth/me/orders"] as const;

export const customerApiClient = axios.create({
  baseURL: ENV.API_URL,
  headers: { [HTTP_HEADER.contentType]: HTTP_CONTENT_TYPE.json },
  timeout: REQUEST_TIMEOUT_MS,
  withCredentials: true,
});

const isBrowser = (): boolean => typeof window !== "undefined";

const isSilentRequest = (error: AxiosError<ApiErrorResponse>): boolean => {
  const url = error.config?.url ?? "";
  return SILENT_ERROR_PATHS.some((path) => url.includes(path));
};

const extractErrorMessage = (error: AxiosError<ApiErrorResponse>): string =>
  error.response?.data?.message ?? error.message ?? FALLBACK_ERROR_MESSAGE;

const handleResponseError = (error: AxiosError<ApiErrorResponse>) => {
  const isUnauthorized = error.response?.status === HTTP_STATUS.unauthorized;
  const silent = isUnauthorized && isSilentRequest(error);

  if (isBrowser() && !silent) {
    toast.error(extractErrorMessage(error));
  }

  return Promise.reject(error);
};

customerApiClient.interceptors.response.use(
  (response) => response,
  handleResponseError,
);
