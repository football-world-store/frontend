"use client";

import { useState } from "react";

import { Badge, Button, IconButton, Modal } from "@/components/atoms";
import { Card, EmptyState, SkeletonTableRow } from "@/components/molecules";
import { useCancelSaleMutation } from "@/hooks/mutations";
import { useSalesQuery } from "@/hooks/queries";
import type { PaymentMethod, SaleChannel, SaleStatus } from "@/types";
import { formatDateBR, formatPriceFromReais } from "@/utils";

const CHANNEL_LABEL: Record<SaleChannel, string> = {
  LOJA_FISICA: "Loja física",
  INSTAGRAM: "Instagram",
  WHATSAPP: "WhatsApp",
  SITE: "Site",
};

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  DINHEIRO: "Dinheiro",
  PIX: "PIX",
  DEBITO: "Débito",
  CREDITO: "Crédito",
};

const STATUS_TONE: Record<SaleStatus, "success" | "neutral"> = {
  CONFIRMED: "success",
  CANCELLED: "neutral",
};

const STATUS_LABEL: Record<SaleStatus, string> = {
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
};

const CANCEL_REASON_MIN_LENGTH = 5;

export const SalesTable = () => {
  const { data, isLoading } = useSalesQuery();
  const sales = data?.items ?? [];
  const cancelMutation = useCancelSaleMutation();

  const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const pendingSale = pendingCancelId
    ? (sales.find((sale) => sale.id === pendingCancelId) ?? null)
    : null;

  const closeCancelModal = () => {
    setPendingCancelId(null);
    setCancelReason("");
  };

  const handleConfirmCancel = () => {
    if (!pendingCancelId) return;
    if (cancelReason.trim().length < CANCEL_REASON_MIN_LENGTH) return;
    cancelMutation.mutate(
      { id: pendingCancelId, cancelReason: cancelReason.trim() },
      { onSettled: closeCancelModal },
    );
  };

  if (isLoading) {
    return (
      <Card title="Vendas" description="Histórico completo">
        <SkeletonTableRow count={6} cells={6} />
      </Card>
    );
  }

  if (sales.length === 0) {
    return (
      <Card title="Vendas" description="Histórico completo">
        <EmptyState
          iconName="point_of_sale"
          title="Sem vendas registradas"
          description="As vendas aparecerão aqui assim que forem registradas."
        />
      </Card>
    );
  }

  const isReasonValid = cancelReason.trim().length >= CANCEL_REASON_MIN_LENGTH;

  return (
    <>
      <Card title="Vendas" description={`${sales.length} registros`}>
        <div className="md:hidden flex flex-col gap-2 rounded-xl overflow-hidden">
          {sales.map((sale, index) => (
            <div
              key={sale.id}
              className={`px-4 py-3 space-y-2 ${
                index % 2 === 0
                  ? "bg-surface-container-low"
                  : "bg-surface-container"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-body text-sm font-semibold text-on-surface">
                    #{sale.saleNumber}
                  </p>
                  <p className="font-label text-xs text-on-surface-variant truncate">
                    {sale.customerName ?? "Sem cliente"}
                  </p>
                </div>
                <Badge tone={STATUS_TONE[sale.status]}>
                  {STATUS_LABEL[sale.status]}
                </Badge>
              </div>
              <div className="flex items-center justify-between font-label text-xs text-on-surface-variant">
                <span>
                  {CHANNEL_LABEL[sale.channel]} ·{" "}
                  {PAYMENT_LABEL[sale.paymentMethod]}
                </span>
                <span className="font-body text-sm font-semibold text-primary">
                  {formatPriceFromReais(sale.totalAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-label text-xs text-on-surface-variant">
                  {formatDateBR(sale.saleDate)}
                </span>
                {sale.status === "CONFIRMED" ? (
                  <IconButton
                    iconName="cancel"
                    label={`Cancelar venda #${sale.saleNumber}`}
                    filled={false}
                    onClick={() => setPendingCancelId(sale.id)}
                  />
                ) : null}
              </div>
            </div>
          ))}
        </div>
        <div className="hidden md:block overflow-x-auto -mx-4 md:mx-0">
          <div className="min-w-[720px] rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 px-4 py-2 font-label uppercase tracking-wider text-xs text-on-surface-variant gap-2">
              <span className="col-span-1">#</span>
              <span className="col-span-3">Cliente</span>
              <span className="col-span-2">Canal</span>
              <span className="col-span-2">Pagamento</span>
              <span className="col-span-2 text-right">Total</span>
              <span className="col-span-1">Status</span>
              <span className="col-span-1 text-right">Ações</span>
            </div>
            {sales.map((sale, index) => (
              <div
                key={sale.id}
                className={`grid grid-cols-12 items-center px-4 py-4 gap-2 ${
                  index % 2 === 0
                    ? "bg-surface-container-low"
                    : "bg-surface-container"
                }`}
              >
                <span className="col-span-1 font-body text-sm font-semibold text-on-surface">
                  #{sale.saleNumber}
                </span>
                <span className="col-span-3 font-body text-sm text-on-surface truncate">
                  {sale.customerName ?? "Sem cliente"}
                </span>
                <span className="col-span-2 font-body text-sm text-on-surface">
                  {CHANNEL_LABEL[sale.channel]}
                </span>
                <span className="col-span-2 font-body text-sm text-on-surface">
                  {PAYMENT_LABEL[sale.paymentMethod]}
                </span>
                <span className="col-span-2 font-body text-sm font-semibold text-primary text-right">
                  {formatPriceFromReais(sale.totalAmount)}
                </span>
                <span className="col-span-1">
                  <Badge tone={STATUS_TONE[sale.status]}>
                    {STATUS_LABEL[sale.status]}
                  </Badge>
                </span>
                <span className="col-span-1 flex justify-end">
                  {sale.status === "CONFIRMED" ? (
                    <IconButton
                      iconName="cancel"
                      label={`Cancelar venda #${sale.saleNumber}`}
                      filled={false}
                      onClick={() => setPendingCancelId(sale.id)}
                    />
                  ) : null}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Modal
        isOpen={pendingCancelId !== null}
        onClose={closeCancelModal}
        title="Cancelar venda?"
        description={
          pendingSale
            ? `Venda #${pendingSale.saleNumber} — ${formatPriceFromReais(pendingSale.totalAmount)}. O estoque dos itens será restaurado.`
            : undefined
        }
        size="md"
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={closeCancelModal}
              disabled={cancelMutation.isPending}
            >
              Voltar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmCancel}
              disabled={!isReasonValid || cancelMutation.isPending}
              className="bg-error bg-none text-on-error hover:bg-error/90 hover:bg-none"
            >
              {cancelMutation.isPending ? "Cancelando…" : "Cancelar venda"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-2">
          <label
            htmlFor="cancel-reason"
            className="font-label text-xs uppercase tracking-wider text-on-surface-variant"
          >
            Motivo do cancelamento
          </label>
          <textarea
            id="cancel-reason"
            value={cancelReason}
            onChange={(event) => setCancelReason(event.target.value)}
            placeholder="Ex.: Cliente desistiu, produto com defeito…"
            rows={4}
            className="w-full rounded-xl bg-surface-container-lowest text-on-surface text-sm font-body p-4 focus-visible:outline-none focus-visible:ring-focus-gold resize-none"
          />
          <p className="font-label text-xs text-on-surface-variant">
            Mínimo {CANCEL_REASON_MIN_LENGTH} caracteres. O estoque dos itens
            volta ao inventário automaticamente.
          </p>
        </div>
      </Modal>
    </>
  );
};
