import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

import { ENV } from "@/constants";
import type { ApiErrorResponse } from "@/types";

const AUTH_TOKEN_STORAGE_KEY = "fws.auth.token";

export const apiClient = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15_000,
});

const attachAuthToken = (config: InternalAxiosRequestConfig) => {
  if (typeof window === "undefined") return config;
  const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
};

const handleResponseError = (error: AxiosError<ApiErrorResponse>) => {
  const message =
    error.response?.data?.message ??
    error.message ??
    "Algo deu errado. Tente novamente.";

  if (typeof window !== "undefined") {
    toast.error(message);
  }

  return Promise.reject(error);
};

apiClient.interceptors.request.use(attachAuthToken);
apiClient.interceptors.response.use(
  (response) => response,
  handleResponseError,
);

export const setAuthToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  }
};
