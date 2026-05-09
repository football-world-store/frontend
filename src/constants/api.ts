export const HTTP_STATUS = {
  unauthorized: 401,
} as const;

export const HTTP_HEADER = {
  contentType: "Content-Type",
} as const;

export const HTTP_CONTENT_TYPE = {
  json: "application/json",
  multipart: "multipart/form-data",
} as const;

export const REQUEST_TIMEOUT_MS = 15_000;

export const FALLBACK_ERROR_MESSAGE = "Algo deu errado. Tente novamente.";
