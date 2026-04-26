/**
 * Nome do cookie de sessão emitido pelo backend (httpOnly + Secure + SameSite=Lax).
 * O frontend NUNCA lê esse cookie no client — apenas o middleware (server-side)
 * verifica a presença para autorizar o acesso a rotas protegidas.
 */
export const SESSION_COOKIE_NAME = "access_token";
