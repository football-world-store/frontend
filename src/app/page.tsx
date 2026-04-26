import { redirect } from "next/navigation";

import { APP_ROUTES } from "@/constants";

/**
 * O proxy (`src/proxy.ts`) redireciona `/` para `/dashboard` ou `/sign-in`
 * conforme a presença do cookie de sessão. Este `redirect()` é fallback defensivo
 * para o caso (raro) do middleware ser bypassado em algum ambiente.
 */
const HomePage = (): never => {
  redirect(APP_ROUTES.auth.signIn);
};

export default HomePage;
