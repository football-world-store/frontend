import { Button, Modal } from "@/components/atoms";
import type { StockEntry } from "@/types";
import { formatDateBR } from "@/utils";

const REVERSE_REASON_MIN_LENGTH = 5;

interface ReverseEntryModalProps {
  entry: StockEntry | null;
  reason: string;
  isPending: boolean;
  onReasonChange: (reason: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export const ReverseEntryModal = ({
  entry,
  reason,
  isPending,
  onReasonChange,
  onClose,
  onConfirm,
}: ReverseEntryModalProps) => {
  const isReasonValid = reason.trim().length >= REVERSE_REASON_MIN_LENGTH;

  return (
    <Modal
      isOpen={entry !== null}
      onClose={onClose}
      title="Estornar entrada?"
      description={
        entry
          ? `${entry.product.name} — ${entry.quantity} unidades em ${formatDateBR(entry.createdAt)}`
          : undefined
      }
      size="md"
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={!isReasonValid || isPending}
            className="bg-error bg-none text-on-error hover:bg-error/90 hover:bg-none"
          >
            {isPending ? "Estornando…" : "Estornar"}
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
          onChange={(event) => onReasonChange(event.target.value)}
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
  );
};
