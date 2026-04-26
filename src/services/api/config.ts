const API_URL =
  typeof window === "undefined"
    ? (process.env.BACKEND_URL ?? "http://localhost:3333")
    : "";

/** Prefixo de versionamento — muda aqui, reflete em todo o app. */
export const API_PREFIX = "/api/v1";

/** URL completa usada como baseURL do axios e dos mocks. */
export const API_BASE_URL = `${API_URL}${API_PREFIX}`;

/** Timeout padrão para requests (em ms). */
export const REQUEST_TIMEOUT_MS = 15_000;

/** Headers padrão para todas as requests. */
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
} as const;
