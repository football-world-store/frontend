import { Badge, Button, Icon } from "@/components/atoms";
import type { PaymentMethod, Sale, SaleChannel } from "@/types";
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

interface SaleReceiptContentProps {
  sale: Sale;
}

export const SaleReceiptContent = ({ sale }: SaleReceiptContentProps) => {
  const subtotal = sale.items.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-headline text-xl font-extrabold text-on-surface">
            Pedido #{sale.saleNumber}
          </p>
          <p className="font-label text-xs text-on-surface-variant">
            {formatDateBR(sale.saleDate)}
          </p>
        </div>
        <Badge tone={sale.status === "CONFIRMED" ? "success" : "neutral"}>
          {sale.status === "CONFIRMED" ? "Confirmada" : "Cancelada"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-xl bg-surface-container-low p-4">
        <div>
          <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
            Cliente
          </p>
          <p className="font-body text-sm text-on-surface">
            {sale.customerName ?? "Sem cliente"}
          </p>
        </div>
        <div>
          <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
            Responsável
          </p>
          <p className="font-body text-sm text-on-surface">{sale.userName}</p>
        </div>
        <div>
          <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
            Canal
          </p>
          <p className="font-body text-sm text-on-surface">
            {CHANNEL_LABEL[sale.channel]}
          </p>
        </div>
        <div>
          <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
            Pagamento
          </p>
          <p className="font-body text-sm text-on-surface">
            {PAYMENT_LABEL[sale.paymentMethod]}
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-1 overflow-hidden rounded-xl">
        {sale.items.map((item, index) => (
          <li
            key={item.id}
            className={`flex items-center justify-between gap-3 px-4 py-3 ${zebraRowTier(index)}`}
          >
            <div className="min-w-0">
              <p className="font-body text-sm font-semibold text-on-surface truncate">
                {item.productName}
              </p>
              <p className="font-label text-xs text-on-surface-variant">
                {item.productInternalCode} · {item.quantity}x{" "}
                {formatPriceFromReais(item.unitPrice)}
              </p>
            </div>
            <span className="font-body text-sm font-semibold text-on-surface">
              {formatPriceFromReais(item.subtotal)}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-1 rounded-xl bg-surface-container-high p-4">
        <div className="flex items-center justify-between font-body text-sm text-on-surface-variant">
          <span>Subtotal</span>
          <span>{formatPriceFromReais(subtotal)}</span>
        </div>
        {sale.discount > 0 ? (
          <div className="flex items-center justify-between font-body text-sm text-on-surface-variant">
            <span>Desconto</span>
            <span>-{formatPriceFromReais(sale.discount)}</span>
          </div>
        ) : null}
        <div className="flex items-center justify-between font-headline text-lg font-extrabold text-primary">
          <span>Total</span>
          <span>{formatPriceFromReais(sale.totalAmount)}</span>
        </div>
      </div>

      {sale.status === "CANCELLED" && sale.cancelReason ? (
        <p className="rounded-xl bg-surface-container-low px-4 py-3 font-label text-xs text-on-surface-variant">
          Motivo do cancelamento: {sale.cancelReason}
        </p>
      ) : null}

      <Button
        type="button"
        variant="secondary"
        onClick={() => window.print()}
        className="print:hidden self-end"
      >
        <Icon name="print" size="sm" />
        Imprimir recibo
      </Button>
    </div>
  );
};
