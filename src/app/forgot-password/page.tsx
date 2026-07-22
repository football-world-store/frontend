import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/organisms";
import { AuthLayout } from "@/components/templates";

export const metadata: Metadata = {
  title: "Recuperar acesso",
  description: "Informe seu email e enviaremos as instruções.",
};

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
