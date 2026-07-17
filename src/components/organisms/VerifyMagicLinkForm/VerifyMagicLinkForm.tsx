"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { Spinner } from "@/components/atoms";
import { useVerifyMagicLinkMutation } from "@/hooks/mutations";

const TOKEN_QUERY_PARAM = "token";

export const VerifyMagicLinkForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get(TOKEN_QUERY_PARAM);
  const mutation = useVerifyMagicLinkMutation();
  const attempted = useRef(false);

  useEffect(() => {
    if (!token || attempted.current) return;
    attempted.current = true;
    mutation.mutate({ token });
  }, [token, mutation]);

  if (!token) {
    return (
      <p className="text-on-surface-variant font-body text-sm">
        Link inválido ou incompleto.
      </p>
    );
  }

  if (mutation.isError) {
    return (
      <p className="text-error font-body text-sm">
        Este link expirou ou já foi usado. Solicite um novo acesso.
      </p>
    );
  }

  return (
    <div className="flex justify-center py-6">
      <Spinner size="lg" tone="primary" />
    </div>
  );
};
