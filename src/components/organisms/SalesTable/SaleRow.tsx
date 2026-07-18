import { Badge, IconButton } from "@/components/atoms";
import type { PaymentMethod, Sale, SaleChannel, SaleStatus } from "@/types";
import { formatDateBR, formatPriceFromReais, zebraRowTier } from "@/utils";

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

interface SaleRowProps {
  sale: Sale;
  index: number;
  onCancel: (id: string) => void;
}

export const SaleRowMobile = ({ sale, index, onCancel }: SaleRowProps) => (
  <div className={`px-4 py-3 space-y-2 ${zebraRowTier(index)}`}>
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="font-body text-sm font-semibold text-on-surface">
          #{sale.saleNumber}
        </p>
        <p className="font-label text-xs text-on-surface-variant truncate">
          {sale.customerName ?? "Sem cliente"}
        </p>
      </div>
      <Badge tone={STATUS_TONE[sale.status]}>{STATUS_LABEL[sale.status]}</Badge>
    </div>
    <div className="flex items-center justify-between font-label text-xs text-on-surface-variant">
      <span>
        {CHANNEL_LABEL[sale.channel]} · {PAYMENT_LABEL[sale.paymentMethod]}
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
          onClick={() => onCancel(sale.id)}
        />
      ) : null}
    </div>
  </div>
);

export const SaleRowDesktop = ({ sale, index, onCancel }: SaleRowProps) => (
  <div
    className={`grid grid-cols-12 items-center px-4 py-4 gap-2 ${zebraRowTier(index)}`}
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
      <Badge tone={STATUS_TONE[sale.status]}>{STATUS_LABEL[sale.status]}</Badge>
    </span>
    <span className="col-span-1 flex justify-end">
      {sale.status === "CONFIRMED" ? (
        <IconButton
          iconName="cancel"
          label={`Cancelar venda #${sale.saleNumber}`}
          filled={false}
          onClick={() => onCancel(sale.id)}
        />
      ) : null}
    </span>
  </div>
);
