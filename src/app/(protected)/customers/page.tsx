"use client";

import { CustomersList } from "@/components/organisms";
import { DashboardLayout } from "@/components/templates";

const CustomersPage = () => {
  return (
    <DashboardLayout
      title="Clientes"
      subtitle="Visão completa da base, com status de engajamento."
    >
      <CustomersList />
    </DashboardLayout>
  );
};

export default CustomersPage;
