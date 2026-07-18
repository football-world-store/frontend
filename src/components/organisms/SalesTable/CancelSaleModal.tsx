import { Button, Modal } from "@/components/atoms";
import type { Sale } from "@/types";
import { formatPriceFromReais } from "@/utils";

const CANCEL_REASON_MIN_LENGTH = 5;

interface CancelSaleModalProps {
  sale: Sale | null;
  reason: string;
  isPending: boolean;
  onReasonChange: (reason: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export const CancelSaleModal = ({
  sale,
  reason,
  isPending,
  onReasonChange,
  onClose,
  onConfirm,
}: CancelSaleModalProps) => {
  const isReasonValid = reason.trim().length >= CANCEL_REASON_MIN_LENGTH;

  return (
    <Modal
      isOpen={sale !== null}
      onClose={onClose}
      title="Cancelar venda?"
      description={
        sale
          ? `Venda #${sale.saleNumber} — ${formatPriceFromReais(sale.totalAmount)}. O estoque dos itens será restaurado.`
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
            Voltar
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={!isReasonValid || isPending}
            className="bg-error bg-none text-on-error hover:bg-error/90 hover:bg-none"
          >
            {isPending ? "Cancelando…" : "Cancelar venda"}
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
          value={reason}
          onChange={(event) => onReasonChange(event.target.value)}
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
  );
};
