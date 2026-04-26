/**
 * Configuração centralizada da API.
 *
 * Toda constante relacionada à comunicação com o backend vive aqui.
 * O `client.ts` consome esta config para criar o axios instance,
 * e os MSW handlers usam `API_BASE_URL` para montar os interceptors.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

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
