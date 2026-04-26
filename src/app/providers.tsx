"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "sonner";

import { AuthProvider, UIProvider } from "@/contexts";
import { createQueryClient } from "@/lib/queryClient";

interface ProvidersProps {
  children: ReactNode;
}

const ENABLE_MOCKS = process.env.NEXT_PUBLIC_ENABLE_MOCKS === "true";

const startMockServiceWorker = async (): Promise<void> => {
  const { worker } = await import("@/mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });
};

export const Providers = ({ children }: ProvidersProps) => {
  const [queryClient] = useState(() => createQueryClient());
  const [mocksReady, setMocksReady] = useState(!ENABLE_MOCKS);

  useEffect(() => {
    if (!ENABLE_MOCKS || mocksReady) {
      return () => {};
    }
    let cancelled = false;
    startMockServiceWorker()
      .then(() => {
        if (!cancelled) setMocksReady(true);
      })
      .catch((error) => {
        console.error("Failed to start mock service worker", error);
      });
    return () => {
      cancelled = true;
    };
  }, [mocksReady]);

  if (!mocksReady) return null;

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
