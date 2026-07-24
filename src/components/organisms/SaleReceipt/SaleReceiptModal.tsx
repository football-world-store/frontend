"use client";

import { Modal, Spinner } from "@/components/atoms";
import { EmptyState } from "@/components/molecules";
import { useSaleQuery } from "@/hooks/queries";

import { SaleReceiptContent } from "./SaleReceiptContent";

interface SaleReceiptModalProps {
  saleId: string | null;
  onClose: () => void;
}

export const SaleReceiptModal = ({
  saleId,
  onClose,
}: SaleReceiptModalProps) => {
  const query = useSaleQuery(saleId ?? "");

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
          iconName="receipt_long"
          title="Não foi possível carregar o recibo"
          description="Tente novamente em instantes."
        />
      );
    }
    return <SaleReceiptContent sale={query.data} />;
  };

  return (
    <Modal
      isOpen={Boolean(saleId)}
      onClose={onClose}
      title="Recibo da venda"
      size="lg"
    >
      {renderBody()}
    </Modal>
  );
};
