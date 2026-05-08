"use client";

import { useState } from "react";

import { Badge, Button, IconButton, Modal } from "@/components/atoms";
import { Card, EmptyState, SkeletonTableRow } from "@/components/molecules";
import { useReverseStockEntryMutation } from "@/hooks/mutations";
import { useStockEntriesQuery } from "@/hooks/queries";
import { formatDateBR, formatPriceFromReais } from "@/utils";

interface StockEntriesTableProps {
  inline?: boolean;
}

const REVERSE_REASON_MIN_LENGTH = 5;

export const StockEntriesTable = ({
  inline = false,
}: StockEntriesTableProps) => {
  const { data, isLoading } = useStockEntriesQuery();
  const entries = data?.items ?? [];
  const reverseMutation = useReverseStockEntryMutation();

  const [pendingReverseId, setPendingReverseId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const pendingEntry = pendingReverseId
    ? (entries.find((entry) => entry.id === pendingReverseId) ?? null)
    : null;

  const closeReverseModal = () => {
    setPendingReverseId(null);
    setReason("");
  };

  const handleConfirmReverse = () => {
    if (!pendingReverseId) return;
    if (reason.trim().length < REVERSE_REASON_MIN_LENGTH) return;
    reverseMutation.mutate(
      { id: pendingReverseId, reason: reason.trim() },
      { onSettled: closeReverseModal },
    );
  };

  const wrapInCard = (
    children: React.ReactNode,
    props?: { title?: string; description?: string },
  ) =>
    inline ? (
      <>{children}</>
    ) : (
      <Card
        title={props?.title ?? "Movimentações"}
        description={props?.description}
      >
        {children}
      </Card>
    );

  if (isLoading) {
    return wrapInCard(<SkeletonTableRow count={5} cells={5} />);
  }

  if (entries.length === 0) {
    return wrapInCard(
      <EmptyState
        iconName="swap_horiz"
        title="Sem entradas registradas"
        description="As movimentações de estoque aparecerão aqui."
      />,
    );
  }

  const canReverse = (movementType: "ENTRY" | "REVERSE") =>
    movementType === "ENTRY";

  const table = (
    <>
      <div className="md:hidden flex flex-col gap-2 rounded-xl overflow-hidden">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className={`px-4 py-3 space-y-1 ${
              index % 2 === 0
                ? "bg-surface-container-low"
                : "bg-surface-container"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-body text-sm font-semibold text-on-surface truncate">
                {entry.productName}
              </span>
              <Badge
                tone={entry.movementType === "ENTRY" ? "success" : "warning"}
              >
                {entry.movementType === "ENTRY" ? "Entrada" : "Estorno"}
              </Badge>
            </div>
            <div className="flex items-center justify-between gap-2 font-label text-xs text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span>{entry.quantity} un.</span>
                <span>·</span>
                <span>
                  {entry.unitCost === null
                    ? "—"
                    : formatPriceFromReais(entry.unitCost)}
                </span>
                <span>·</span>
                <span>{formatDateBR(entry.entryDate)}</span>
              </div>
              {canReverse(entry.movementType) ? (
                <IconButton
                  iconName="undo"
                  label={`Estornar ${entry.productName}`}
                  filled={false}
                  onClick={() => setPendingReverseId(entry.id)}
                />
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:block overflow-x-auto -mx-4 md:mx-0">
        <div className="min-w-[640px] rounded-xl overflow-hidden">
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className={`grid grid-cols-12 items-center px-4 py-4 gap-2 transition-colors hover:bg-surface-bright ${
                index % 2 === 0
                  ? "bg-surface-container-low"
                  : "bg-surface-container"
              }`}
            >
              <span className="col-span-3 font-body text-sm text-on-surface">
                {entry.productName}
              </span>
              <span className="col-span-2">
                <Badge
                  tone={entry.movementType === "ENTRY" ? "success" : "warning"}
                >
                  {entry.movementType === "ENTRY" ? "Entrada" : "Estorno"}
                </Badge>
              </span>
              <span className="col-span-2 font-body text-sm text-on-surface">
                {entry.quantity} un.
              </span>
              <span className="col-span-2 font-body text-sm text-on-surface">
                {entry.unitCost === null
                  ? "—"
                  : formatPriceFromReais(entry.unitCost)}
              </span>
              <span className="col-span-2 font-label text-xs text-on-surface-variant text-right">
                {formatDateBR(entry.entryDate)}
              </span>
              <span className="col-span-1 flex justify-end">
                {canReverse(entry.movementType) ? (
                  <IconButton
                    iconName="undo"
                    label={`Estornar ${entry.productName}`}
                    filled={false}
                    onClick={() => setPendingReverseId(entry.id)}
                  />
                ) : null}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const isReasonValid = reason.trim().length >= REVERSE_REASON_MIN_LENGTH;

  return (
    <>
      {wrapInCard(table, {
        title: "Movimentações",
        description: `${entries.length} registros`,
      })}

      <Modal
        isOpen={pendingReverseId !== null}
        onClose={closeReverseModal}
        title="Estornar entrada?"
        description={
          pendingEntry
            ? `${pendingEntry.productName} — ${pendingEntry.quantity} unidades em ${formatDateBR(pendingEntry.entryDate)}`
            : undefined
        }
        size="md"
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={closeReverseModal}
              disabled={reverseMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmReverse}
              disabled={!isReasonValid || reverseMutation.isPending}
              className="bg-error bg-none text-on-error hover:bg-error/90 hover:bg-none"
            >
              {reverseMutation.isPending ? "Estornando…" : "Estornar"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-2">
          <label
            htmlFor="reverse-reason"
            className="font-label text-xs uppercase tracking-wider text-on-surface-variant"
          >
            Motivo do estorno
          </label>
          <textarea
            id="reverse-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Ex.: Lote vencido, devolução ao fornecedor…"
            rows={4}
            className="w-full rounded-xl bg-surface-container-lowest text-on-surface text-sm font-body p-4 focus-visible:outline-none focus-visible:ring-focus-gold resize-none"
          />
          <p className="font-label text-xs text-on-surface-variant">
            Mínimo {REVERSE_REASON_MIN_LENGTH} caracteres. O estorno cria uma
            movimentação inversa e ajusta o estoque.
          </p>
        </div>
      </Modal>
    </>
  );
};
