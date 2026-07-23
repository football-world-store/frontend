import type { Metadata } from "next";
import { Suspense } from "react";

import { Spinner } from "@/components/atoms";
import { ResetPasswordForm } from "@/components/organisms";
import { AuthLayout } from "@/components/templates";

export const metadata: Metadata = {
  title: "Nova senha",
  description:
    "Digite o código que enviamos por email e cadastre uma nova senha.",
};

const ResetPasswordPage = () => {
  return (
    <AuthLayout
      title={
        <>
          Definir <span className="text-primary italic">nova senha</span>
        </>
      }
      description="Digite o código que enviamos por email e cadastre uma nova senha."
    >
      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <Spinner size="lg" tone="primary" />
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
