"use client";

import { CustomerReservationsList } from "@/components/organisms";
import { PortalShell } from "@/components/templates";
import { APP_ROUTES } from "@/constants";

const CustomerReservationsPage = () => (
  <PortalShell
    active={APP_ROUTES.portal.reservations}
    eyebrow="Área do cliente"
    title={
      <>
        Minhas <span className="text-primary italic">reservas</span>
      </>
    }
    description="Consulte os produtos reservados e os prazos de retirada."
  >
    <CustomerReservationsList />
  </PortalShell>
);

export default CustomerReservationsPage;
