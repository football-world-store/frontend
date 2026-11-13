"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { APP_ROUTES } from "@/constants";

const PublicHomeRedirectPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace(APP_ROUTES.home);
  }, [router]);

  return null;
};

export default PublicHomeRedirectPage;
