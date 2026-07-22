import type { Metadata } from "next";
import { Suspense } from "react";

import { Spinner } from "@/components/atoms";
import { VerifyMagicLinkForm } from "@/components/organisms";
import { AuthLayout } from "@/components/templates";

export const metadata: Metadata = {
  title: "Confirmando acesso",
  description: "Aguarde enquanto validamos seu link de acesso.",
};

const VerifyPage = () => {
  return (
    <AuthLayout
      title={
        <>
          Confirmando <span className="text-primary italic">acesso</span>
        </>
      }
      description="Aguarde enquanto validamos seu link de acesso."
    >
      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <Spinner size="lg" tone="primary" />
          </div>
        }
      >
        <VerifyMagicLinkForm />
      </Suspense>
    </AuthLayout>
  );
};

export default VerifyPage;
