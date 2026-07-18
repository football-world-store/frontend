import type { AxiosError } from "axios";

import {
  ERROR_MESSAGES,
  FALLBACK_ERROR_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  TIMEOUT_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
} from "@/constants";
import type { ApiErrorResponse } from "@/types";

const CODE_PREFIX_SEPARATOR = ":";

const resolveByCode = (message: string): string | undefined => {
  if (ERROR_MESSAGES[message]) return ERROR_MESSAGES[message];

  const [prefix] = message.split(CODE_PREFIX_SEPARATOR);
  return prefix ? ERROR_MESSAGES[prefix] : undefined;
};

const resolveNetworkErrorMessage = (
  error: AxiosError<ApiErrorResponse>,
): string | undefined => {
  if (error.code === "ECONNABORTED") return TIMEOUT_ERROR_MESSAGE;
  if (!error.response) return NETWORK_ERROR_MESSAGE;
  return undefined;
};

export const extractErrorMessage = (
  error: AxiosError<ApiErrorResponse>,
): string => {
  const networkMessage = resolveNetworkErrorMessage(error);
  if (networkMessage) return networkMessage;

  const message = error.response?.data?.message;
  if (Array.isArray(message)) return VALIDATION_ERROR_MESSAGE;
  if (typeof message === "string") {
    return resolveByCode(message) ?? FALLBACK_ERROR_MESSAGE;
  }

  return FALLBACK_ERROR_MESSAGE;
};
