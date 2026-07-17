"use client";

import { RequestMagicLinkForm } from "@/components/organisms";
import { AuthLayout } from "@/components/templates";

const PortalPage = () => {
  return (
    <AuthLayout
      title={
        <>
          Acesse seus <span className="text-primary italic">pedidos</span>
        </>
      }
      description="Informe seu email e enviaremos um link de acesso — sem senha."
      side={
        <p className="font-label text-on-surface-variant text-xs uppercase tracking-widest">
          Elite Performance Tier
        </p>
      }
    >
      <RequestMagicLinkForm />
    </AuthLayout>
  );
};

export default PortalPage;
