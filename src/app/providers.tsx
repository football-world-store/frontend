"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";
import { Toaster } from "sonner";

import { AuthProvider, UIProvider } from "@/contexts";
import { createQueryClient } from "@/lib/queryClient";

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UIProvider>
          {children}
          <Toaster richColors position="top-right" closeButton />
          <ReactQueryDevtools initialIsOpen={false} />
        </UIProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
