"use client";

import { type ReactNode } from "react";

import { Spinner } from "@/components/atoms";
import { AuthProvider, useAuth } from "@/contexts";

interface ProtectedLayoutProps {
  children: ReactNode;
}

const ProtectedGate = ({ children }: ProtectedLayoutProps) => {
  const { isLoading } = useAuth();

  // Proxy (src/proxy.ts) já barrou não-autenticados via cookie de sessão.
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

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => (
  <AuthProvider>
    <ProtectedGate>{children}</ProtectedGate>
  </AuthProvider>
);

export default ProtectedLayout;
