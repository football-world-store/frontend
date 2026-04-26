"use client";

import { InventoryTable } from "@/components/organisms";
import { DashboardLayout } from "@/components/templates";

const InventoryPage = () => {
  return (
    <DashboardLayout
      title="Inventário"
      subtitle="Catálogo completo, filtros e disponibilidade em tempo real."
    >
      <InventoryTable />
    </DashboardLayout>
  );
};

export default InventoryPage;
