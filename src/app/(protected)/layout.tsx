"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { Spinner } from "@/components/atoms";
import { AuthProvider, useAuth } from "@/contexts";
import { APP_ROUTES } from "@/constants";

interface ProtectedLayoutProps {
  children: ReactNode;
}

const ProtectedGate = ({ children }: ProtectedLayoutProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const path = window.location.pathname + window.location.search;
      router.replace(
        `${APP_ROUTES.auth.signIn}?redirect=${encodeURIComponent(path)}`,
      );
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="bg-surface flex min-h-screen items-center justify-center">
        <Spinner size="lg" tone="primary" />
      </div>
    );
  }

  return <>{children}</>;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => (
  <AuthProvider>
    <ProtectedGate>{children}</ProtectedGate>
  </AuthProvider>
);

export default ProtectedLayout;
