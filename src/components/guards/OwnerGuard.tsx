"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { Spinner } from "@/components/atoms";
import { useAuth } from "@/contexts";
import { APP_ROUTES } from "@/constants";

interface OwnerGuardProps {
  children: ReactNode;
}

const OwnerGuard = ({ children }: OwnerGuardProps) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && user.role !== "OWNER") {
      router.replace(APP_ROUTES.app.inventory);
    }
  }, [isLoading, user, router]);

  if (isLoading || !user || user.role !== "OWNER") {
    return (
      <div className="bg-surface flex min-h-screen items-center justify-center">
        <Spinner size="lg" tone="primary" />
      </div>
    );
  }

  return <>{children}</>;
};

export default OwnerGuard;
