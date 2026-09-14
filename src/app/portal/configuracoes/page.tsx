"use client";

import { Spinner } from "@/components/atoms";
import { CustomerProfileForm } from "@/components/organisms";
import { PortalShell } from "@/components/templates";
import { APP_ROUTES } from "@/constants";
import { useCustomerProfileQuery } from "@/hooks/queries";

const PortalSettingsPage = () => {
  const { data: profile, isLoading } = useCustomerProfileQuery();

  return (
    <PortalShell
      active={APP_ROUTES.portal.settings}
      eyebrow="Área do cliente"
      title={
        <>
          Minhas <span className="text-primary italic">configurações</span>
        </>
      }
      description="Atualize seus dados de contato e sua senha de acesso."
    >
      {isLoading || !profile ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <CustomerProfileForm profile={profile} />
      )}
    </PortalShell>
  );
};

export default PortalSettingsPage;
