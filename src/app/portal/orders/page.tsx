"use client";

import { CustomerOrdersList } from "@/components/organisms";
import { PortalShell } from "@/components/templates";
import { APP_ROUTES } from "@/constants";
import { useCustomerProfileQuery } from "@/hooks/queries";

const PortalOrdersPage = () => {
  const { data: profile } = useCustomerProfileQuery();
  const name = profile?.name ?? "Cliente";

  return (
    <PortalShell
      active={APP_ROUTES.portal.orders}
      eyebrow="Área do cliente"
      title={
        <>
          Olá, <span className="text-primary italic">{name.split(" ")[0]}</span>
        </>
      }
      description="Acompanhe suas compras e reservas em um só lugar."
    >
      <CustomerOrdersList />
    </PortalShell>
  );
};

export default PortalOrdersPage;
