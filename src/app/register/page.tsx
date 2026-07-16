"use client";

import { RegisterForm } from "@/components/organisms";
import { AuthLayout } from "@/components/templates";

const RegisterPage = () => {
  return (
    <AuthLayout
      title={
        <>
          Solicitar <span className="text-primary italic">Acesso</span>
        </>
      }
      description="Crie sua conta. Um administrador precisa aprovar antes do primeiro login."
      side={
        <p className="font-label text-on-surface-variant text-xs uppercase tracking-widest">
          Elite Performance Tier
        </p>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
