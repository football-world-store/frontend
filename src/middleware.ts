import { NextResponse, type NextRequest } from "next/server";

import { APP_ROUTES, SESSION_COOKIE_NAME } from "@/constants";

const AUTH_ROUTES: readonly string[] = [
  APP_ROUTES.auth.signIn,
  APP_ROUTES.auth.forgotPassword,
  APP_ROUTES.auth.resetPassword,
];

const isAuthRoute = (pathname: string): boolean =>
  AUTH_ROUTES.some((route) => pathname.startsWith(route));

const isHomeRoute = (pathname: string): boolean => pathname === APP_ROUTES.home;

export const middleware = (request: NextRequest): NextResponse => {
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  const { pathname, search } = request.nextUrl;

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
    const signInUrl = new URL(APP_ROUTES.auth.signIn, request.url);
    signInUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
};

/**
 * Roda em todas as rotas exceto assets estáticos, proxy de API e o service
 * worker do MSW. Mantém a checagem de sessão server-side, antes do React montar.
 */
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|mockServiceWorker.js|.*\\.).*)",
  ],
};
