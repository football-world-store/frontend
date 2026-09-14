import { redirect } from "next/navigation";

import { APP_ROUTES } from "@/constants";

const PortalEntryPage = () => {
  redirect(APP_ROUTES.auth.signIn);
};

export default PortalEntryPage;
