"use client";

import { ReservationsTable } from "@/components/organisms";
import { DashboardLayout } from "@/components/templates";

const ReservationsPage = () => (
  <DashboardLayout
    title={
      <>
        <span className="font-label text-xs uppercase tracking-widest text-primary block">
          Chatbot
        </span>
        RESERVAS
      </>
    }
    subtitle="Gerencie as reservas criadas pelo chatbot. Confirme para debitar o estoque."
  >
    <ReservationsTable />
  </DashboardLayout>
);

export default ReservationsPage;
