"use client";

import { RegisterCustomerForm } from "@/components/organisms";
import { AuthLayout } from "@/components/templates";

const RegisterPage = () => {
  return (
    <AuthLayout
      title={
        <>
          Criar <span className="text-primary italic">conta</span>
        </>
      }
      description="Cadastre-se para acompanhar seus pedidos e reservas."
      side={
        <p className="font-label text-on-surface-variant text-xs uppercase tracking-widest">
          Elite Performance Tier
        </p>
      }
    >
      <RegisterCustomerForm />
    </AuthLayout>
  );
};

export default RegisterPage;
