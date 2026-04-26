"use client";

import { type ReactNode } from "react";

import { Spinner } from "@/components/atoms";
import { useAuth } from "@/contexts";

interface ProtectedLayoutProps {
  children: ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const { isLoading } = useAuth();

  // Middleware (src/middleware.ts) já barrou não-autenticados via cookie de sessão.
  // Aqui só seguramos o primeiro paint enquanto o /auth/me resolve para hidratar
  // dados do usuário no AuthContext.
  if (isLoading) {
    return (
      <div className="bg-surface flex min-h-screen items-center justify-center">
        <Spinner size="lg" tone="primary" />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedLayout;
