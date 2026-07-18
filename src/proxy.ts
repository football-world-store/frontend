import { NextResponse, type NextRequest } from "next/server";

import { APP_ROUTES, SESSION_COOKIE_NAME } from "@/constants";
import type { AuthUser } from "@/types";

const AUTH_ROUTES: readonly string[] = [
  APP_ROUTES.auth.signIn,
  APP_ROUTES.auth.register,
  APP_ROUTES.auth.forgotPassword,
  APP_ROUTES.auth.resetPassword,
];

// Controllers com `@Roles('OWNER')` no NestJS (backend/src/modules/{dashboard,alerts,audit}
// e a gestão de usuários dentro de users.controller.ts) — EMPLOYEE recebe 403 em toda
// chamada dessas páginas, então bloqueamos a rota inteira aqui antes do React montar.
const OWNER_ONLY_ROUTES: readonly string[] = [
  APP_ROUTES.app.dashboard,
  APP_ROUTES.app.insights,
  APP_ROUTES.app.alerts,
  APP_ROUTES.app.audit,
  APP_ROUTES.app.settings,
];

// Primeira rota que um EMPLOYEE de fato consegue usar por completo — usada como
// destino de redirect quando ele tenta acessar uma rota OWNER-only.
const EMPLOYEE_FALLBACK_ROUTE = APP_ROUTES.app.inventory;

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3333";

const isAuthRoute = (pathname: string): boolean =>
  AUTH_ROUTES.some((route) => pathname.startsWith(route));

const isHomeRoute = (pathname: string): boolean => pathname === APP_ROUTES.home;

const isPortalRoute = (pathname: string): boolean =>
  pathname === APP_ROUTES.portal.root ||
  pathname.startsWith(`${APP_ROUTES.portal.root}/`) ||
  pathname === APP_ROUTES.portal.verify;

const isOwnerOnlyRoute = (pathname: string): boolean =>
  OWNER_ONLY_ROUTES.some((route) => pathname.startsWith(route));

interface MeResponse {
  data: AuthUser;
}

const fetchCurrentUser = async (
  sessionCookie: string,
): Promise<AuthUser | null> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/users/me`, {
      headers: { cookie: `${SESSION_COOKIE_NAME}=${sessionCookie}` },
    });
    if (!response.ok) return null;
    const body = (await response.json()) as MeResponse;
    return body.data;
  } catch {
    return null;
  }
};

const buildSignInRedirect = (request: NextRequest): NextResponse => {
  const { pathname, search } = request.nextUrl;
  const signInUrl = new URL(APP_ROUTES.auth.signIn, request.url);
  signInUrl.searchParams.set("redirect", `${pathname}${search}`);
  return NextResponse.redirect(signInUrl);
};

// Rota OWNER-only + sessão de EMPLOYEE → bloqueia antes do React montar.
// O role não está no JWT do Cognito (só o `sub`); a única fonte da verdade
// é o Postgres consultado em GET /users/me, então checamos aqui.
const guardOwnerOnlyRoute = async (
  request: NextRequest,
): Promise<NextResponse | null> => {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const currentUser = sessionCookie
    ? await fetchCurrentUser(sessionCookie)
    : null;

  if (!currentUser) return buildSignInRedirect(request);
  if (currentUser.role === "OWNER") return null;

  return NextResponse.redirect(new URL(EMPLOYEE_FALLBACK_ROUTE, request.url));
};

const guardSessionRouting = (
  request: NextRequest,
  hasSession: boolean,
): NextResponse | null => {
  const { pathname } = request.nextUrl;

  // Home (/) → redireciona conforme sessão.
  if (isHomeRoute(pathname)) {
    const target = hasSession
      ? APP_ROUTES.app.dashboard
      : APP_ROUTES.auth.signIn;
    return NextResponse.redirect(new URL(target, request.url));
  }

  // Rota de auth + sessão ativa → não deixa ver login/forgot novamente.
  if (isAuthRoute(pathname) && hasSession) {
    return NextResponse.redirect(
      new URL(APP_ROUTES.app.dashboard, request.url),
    );
  }

  // Rota protegida + sem sessão → manda pro sign-in com `redirect` p/ voltar depois.
  if (!isAuthRoute(pathname) && !hasSession) {
    return buildSignInRedirect(request);
  }

  return null;
};

export const proxy = async (request: NextRequest): Promise<NextResponse> => {
  const { pathname } = request.nextUrl;

  // Portal do cliente: sessão é um cookie separado (customer_access_token),
  // invisível para este proxy. Não fazemos gating de sessão aqui — a página
  // de pedidos descobre "logado ou não" client-side via 401 em
  // GET /customer-auth/me/orders. Isso só evita que a lógica de sessão
  // STAFF (access_token) redirecione essas rotas em qualquer direção.
  if (isPortalRoute(pathname)) {
    return NextResponse.next();
  }

  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  const sessionRedirect = guardSessionRouting(request, hasSession);
  if (sessionRedirect) return sessionRedirect;

  if (isOwnerOnlyRoute(pathname)) {
    const blocked = await guardOwnerOnlyRoute(request);
    if (blocked) return blocked;
  }

  return NextResponse.next();
};

/**
 * Roda em todas as rotas exceto assets estáticos, proxy de API e o service
 * worker do MSW. Mantém a checagem de sessão server-side, antes do React montar.
 *
 * Convenção `proxy.ts` introduzida no Next 16 (substitui `middleware.ts`).
 */
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|mockServiceWorker.js|.*\\.).*)",
  ],
};
