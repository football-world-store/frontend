"use client";

import { useEffect } from "react";

import { Button, Icon, Spinner } from "@/components/atoms";
import { EmptyState } from "@/components/molecules";
import type { Sale } from "@/types";

import { SaleReceiptContent } from "../SaleReceipt/SaleReceiptContent";

interface ReceiptPageProps {
  sale: Sale | undefined;
  isLoading: boolean;
  isError: boolean;
  onBack: () => void;
  backLabel: string;
}

/**
 * Página dedicada de recibo — usada tanto pelo admin (/sales/[id]/recibo)
 * quanto pelo portal do cliente (/portal/orders/[id]).
 *
 * Existe como página (e não modal) porque o nome do PDF gerado pelo
 * navegador vem do <title> do documento: aqui ele vira
 * "Recibo #9 - Fulano" em vez de "Football World Store". Imprimir uma
 * página normal também dispensa CSS acrobático para escapar do
 * top-layer do <dialog>.
 */
export const ReceiptPage = ({
  sale,
  isLoading,
  isError,
  onBack,
  backLabel,
}: ReceiptPageProps) => {
  useEffect(() => {
    if (!sale) return undefined;
    const previousTitle = document.title;
    // Data em AAAA-MM-DD (sem "/", que quebraria o nome do arquivo do PDF)
    const date = new Date(sale.saleDate).toISOString().slice(0, 10);
    const customer = sale.customerName ? ` - ${sale.customerName}` : "";
    document.title = `Recibo #${sale.saleNumber}${customer} - ${date}`;
    return () => {
      document.title = previousTitle;
    };
  }, [sale]);

  const renderBody = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-16">
          <Spinner size="lg" tone="primary" />
        </div>
      );
    }
    if (isError || !sale) {
      return (
        <EmptyState
          iconName="receipt_long"
          title="Não foi possível carregar o recibo"
          description="Verifique o link ou tente novamente em instantes."
        />
      );
    }
    return <SaleReceiptContent sale={sale} />;
  };

  return (
    <main className="min-h-screen print:min-h-0 bg-surface print:bg-white p-4 md:p-10 print:p-0 font-body text-on-surface">
      <div className="mx-auto max-w-3xl space-y-6 print:space-y-0">
        <div className="flex items-center justify-between gap-3 print:hidden">
          <Button type="button" variant="ghost" onClick={onBack}>
            <Icon name="arrow_back" size="sm" />
            {backLabel}
          </Button>
          {sale ? (
            <Button type="button" onClick={() => window.print()}>
              <Icon name="print" size="sm" />
              Imprimir recibo
            </Button>
          ) : null}
        </div>

        <div className="rounded-xl bg-surface-container p-5 md:p-8 print:p-0">
          {/* Identificação da loja — só no papel, a tela já tem a marca no chrome */}
          <div className="hidden print:block mb-6">
            <p className="font-headline text-lg font-extrabold">
              Football World Store
            </p>
            <p className="font-label text-xs">Comprovante de compra</p>
          </div>
          {renderBody()}
        </div>
      </div>
    </main>
  );
};
