"use client";

import { useState } from "react";

import { Badge, Spinner } from "@/components/atoms";
import { Card, EmptyState } from "@/components/molecules";
import { CustomerOrderReceiptModal } from "@/components/organisms/SaleReceipt";
import { useCustomerOrdersQuery } from "@/hooks/queries";
import type { CustomerReservation, Sale } from "@/types";
import { formatDateBR, formatPriceFromReais, zebraRowTier } from "@/utils";

const SALE_STATUS_TONE: Record<Sale["status"], "success" | "neutral"> = {
  CONFIRMED: "success",
  CANCELLED: "neutral",
};

const RESERVATION_STATUS_TONE: Record<
  CustomerReservation["status"],
  "success" | "neutral" | "error"
> = {
  PENDING: "neutral",
  CONFIRMED: "success",
  CANCELLED: "neutral",
  EXPIRED: "error",
};

interface PurchasesSectionProps {
  purchases: Sale[];
  onSelect: (id: string) => void;
}

const PurchasesSection = ({ purchases, onSelect }: PurchasesSectionProps) => (
  <Card title="Compras">
    {purchases.length === 0 ? (
      <EmptyState
        iconName="shopping_bag"
        title="Nenhuma compra encontrada"
        description="Suas compras aparecerão aqui."
      />
    ) : (
      <ul className="space-y-2">
        {purchases.map((sale, index) => (
          <li key={sale.id}>
            <button
              type="button"
              onClick={() => onSelect(sale.id)}
              className={`flex w-full items-center justify-between gap-4 rounded-xl px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-focus-gold ${zebraRowTier(index)}`}
            >
              <div>
                <p className="font-body text-sm font-semibold text-on-surface">
                  Pedido #{sale.saleNumber}
                </p>
                <p className="font-label text-xs text-on-surface-variant">
                  {formatDateBR(sale.saleDate)} ·{" "}
                  {formatPriceFromReais(sale.totalAmount)}
                </p>
              </div>
              <Badge tone={SALE_STATUS_TONE[sale.status]}>{sale.status}</Badge>
            </button>
          </li>
        ))}
      </ul>
    )}
  </Card>
);

const ReservationsSection = ({
  reservations,
}: {
  reservations: CustomerReservation[];
}) => (
  <Card title="Reservas">
    {reservations.length === 0 ? (
      <EmptyState
        iconName="event_available"
        title="Nenhuma reserva encontrada"
        description="Suas reservas aparecerão aqui."
      />
    ) : (
      <ul className="space-y-2">
        {reservations.map((reservation, index) => (
          <li
            key={reservation.id}
            className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3 ${zebraRowTier(index)}`}
          >
            <div>
              <p className="font-body text-sm font-semibold text-on-surface">
                {reservation.productName} ({reservation.size})
              </p>
              <p className="font-label text-xs text-on-surface-variant">
                {formatDateBR(reservation.createdAt)} · {reservation.quantity}x
              </p>
            </div>
            <Badge tone={RESERVATION_STATUS_TONE[reservation.status]}>
              {reservation.status}
            </Badge>
          </li>
        ))}
      </ul>
    )}
  </Card>
);

export const CustomerOrdersList = () => {
  const query = useCustomerOrdersQuery();
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);

  if (query.isPending) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" tone="primary" />
      </div>
    );
  }

  if (query.isError) {
    return (
      <Card>
        <EmptyState
          iconName="lock"
          title="Sessão expirada"
          description="Solicite um novo link de acesso para ver seus pedidos."
        />
      </Card>
    );
  }

  const { purchases = [], reservations = [] } = query.data ?? {};

  return (
    <div className="space-y-6">
      <PurchasesSection purchases={purchases} onSelect={setSelectedSaleId} />
      <ReservationsSection reservations={reservations} />

      <CustomerOrderReceiptModal
        saleId={selectedSaleId}
        onClose={() => setSelectedSaleId(null)}
      />
    </div>
  );
};
