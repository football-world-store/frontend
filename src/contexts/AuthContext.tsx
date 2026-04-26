"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

import { useMeQuery } from "@/hooks/queries/useMeQuery";
import { useLogoutMutation } from "@/hooks/mutations/useLogoutMutation";
import type { AuthUser } from "@/types";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const meQuery = useMeQuery();
  const logoutMutation = useLogoutMutation();

  const value = useMemo<AuthContextValue>(
    () => ({
      user: meQuery.data ?? null,
      isAuthenticated: Boolean(meQuery.data),
      isLoading: meQuery.isPending,
      signOut: () => logoutMutation.mutate(),
    }),
    [meQuery.data, meQuery.isPending, logoutMutation],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
