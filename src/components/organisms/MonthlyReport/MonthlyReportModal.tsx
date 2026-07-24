"use client";

import { useState } from "react";

import { Button, Icon, Modal, Spinner } from "@/components/atoms";
import { EmptyState, FormField } from "@/components/molecules";
import { useMonthlyReportQuery } from "@/hooks/queries";

import { MonthlyReportContent } from "./MonthlyReportContent";

interface MonthlyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const currentMonth = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
};

export const MonthlyReportModal = ({
  isOpen,
  onClose,
}: MonthlyReportModalProps) => {
  const [month, setMonth] = useState(currentMonth);
  const query = useMonthlyReportQuery(month, isOpen);

  const renderBody = () => {
    if (query.isPending) {
      return (
        <div className="flex justify-center py-8">
          <Spinner size="lg" tone="primary" />
        </div>
      );
    }
    if (query.isError || !query.data) {
      return (
        <EmptyState
          iconName="summarize"
          title="Não foi possível carregar o relatório"
          description="Verifique o mês selecionado e tente novamente."
        />
      );
    }
    return <MonthlyReportContent report={query.data} />;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Relatório mensal"
      description="Resumo agregado de estoque, vendas e produtos do mês."
      size="lg"
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-end gap-3 print:hidden">
          <FormField
            label="Mês"
            type="month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.print()}
            disabled={!query.data}
          >
            <Icon name="print" size="sm" />
            Imprimir
          </Button>
        </div>
        {renderBody()}
      </div>
    </Modal>
  );
};
