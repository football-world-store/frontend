"use client";

import { ResetPasswordForm } from "@/components/organisms";
import { AuthLayout } from "@/components/templates";

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
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPasswordPage;
