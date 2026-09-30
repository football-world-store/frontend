"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { APP_ROUTES } from "@/constants";

const PortalEntryPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace(APP_ROUTES.auth.signIn);
  }, [router]);

  return null;
};

export default PortalEntryPage;
