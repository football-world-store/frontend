"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import { queryKeys } from "@/constants";
import type { CustomerIdentity } from "@/types";

interface CustomerAuthContextValue {
  identity: CustomerIdentity | null;
  isAuthenticated: boolean;
  setIdentity: (identity: CustomerIdentity | null) => void;
  markLoggedOut: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(
  null,
);

interface CustomerAuthProviderProps {
  children: ReactNode;
}

export const CustomerAuthProvider = ({
  children,
}: CustomerAuthProviderProps) => {
  const queryClient = useQueryClient();

  const identity =
    queryClient.getQueryData<CustomerIdentity | null>(
      queryKeys.customerAuth.identity(),
    ) ?? null;

  const setIdentity = useCallback(
    (next: CustomerIdentity | null) => {
      queryClient.setQueryData(queryKeys.customerAuth.identity(), next);
    },
    [queryClient],
  );

  const markLoggedOut = useCallback(() => {
    queryClient.setQueryData(queryKeys.customerAuth.identity(), null);
    queryClient.removeQueries({ queryKey: queryKeys.customerAuth.orders() });
  }, [queryClient]);

  const value = useMemo<CustomerAuthContextValue>(
    () => ({
      isAuthenticated: Boolean(identity),
      identity,
      setIdentity,
      markLoggedOut,
    }),
    [identity, setIdentity, markLoggedOut],
  );

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = (): CustomerAuthContextValue => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error(
      "useCustomerAuth must be used within a CustomerAuthProvider",
    );
  }
  return context;
};
