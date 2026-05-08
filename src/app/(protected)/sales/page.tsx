"use client";

import { useState } from "react";

import { Button, Icon, Modal } from "@/components/atoms";
import { SaleForm, SalesTable } from "@/components/organisms";
import { DashboardLayout } from "@/components/templates";

const SalesPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <DashboardLayout
      title={
        <>
          <span className="font-label text-xs uppercase tracking-widest text-primary block">
            Operações
          </span>
          VENDAS
        </>
      }
      subtitle="Histórico de vendas, cancelamentos e novos registros."
      toolbar={
        <div className="flex justify-end">
          <Button
            className="w-full md:w-auto"
            onClick={() => setIsCreateOpen(true)}
          >
            <Icon name="add_shopping_cart" size="sm" />
            Registrar nova venda
          </Button>
        </div>
      }
    >
      <SalesTable />

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Registrar venda"
        description="Selecione os produtos, canal e forma de pagamento."
        size="xl"
      >
        <SaleForm
          onSuccess={() => setIsCreateOpen(false)}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default SalesPage;
