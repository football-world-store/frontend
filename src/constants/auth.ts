/**
 * Nome do cookie de sessão (access_token) emitido pelo backend
 * (httpOnly + Secure + SameSite=Lax). O frontend NUNCA lê esse cookie no
 * client — apenas o middleware (server-side) verifica a presença para
 * autorizar o acesso a rotas protegidas.
 */
export const SESSION_COOKIE_NAME = "access_token";

/**
 * Nome do cookie de refresh emitido pelo backend, também httpOnly. Usado pelo
 * navegador para renovar o access_token via POST /auth/refresh sem expor o
 * token ao JS do client.
 */
export const REFRESH_COOKIE_NAME = "refresh_token";
