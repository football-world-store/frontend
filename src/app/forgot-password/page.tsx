"use client";

import { ForgotPasswordForm } from "@/components/organisms";
import { AuthLayout } from "@/components/templates";

const ForgotPasswordPage = () => {
  return (
    <AuthLayout
      title={
        <>
          Recuperar <span className="text-primary italic">acesso</span>
        </>
      }
      description="Informe seu email e enviaremos as instruções."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
