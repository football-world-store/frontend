"use client";

import { Badge, Spinner } from "@/components/atoms";
import { Card, EmptyState } from "@/components/molecules";
import { useCustomerOrdersQuery } from "@/hooks/queries";
import type { CustomerOrder } from "@/types";
import { formatDateBR, formatPriceFromReais, zebraRowTier } from "@/utils";

const STATUS_TONE: Record<string, "success" | "neutral" | "error"> = {
  CONFIRMED: "success",
  CANCELLED: "neutral",
  CONFIRMADA: "success",
  CANCELADA: "neutral",
  EXPIRADA: "error",
};

const orderLabel = (order: CustomerOrder): string =>
  order.kind === "sale"
    ? `Pedido #${order.saleNumber}`
    : `Reserva — ${order.productName ?? "produto"}`;

const orderDetail = (order: CustomerOrder): string =>
  order.kind === "sale"
    ? formatPriceFromReais(order.totalAmount)
    : `${order.quantity}x`;

export const CustomerOrdersList = () => {
  const query = useCustomerOrdersQuery();

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

  const orders = query.data ?? [];

  if (orders.length === 0) {
    return (
      <Card>
        <EmptyState
          iconName="inbox"
          title="Nenhum pedido encontrado"
          description="Suas compras e reservas aparecerão aqui."
        />
      </Card>
    );
  }

  return (
    <Card>
      <ul className="space-y-2">
        {orders.map((order, index) => (
          <li
            key={`${order.kind}-${order.id}`}
            className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3 ${zebraRowTier(index)}`}
          >
            <div>
              <p className="font-body text-sm font-semibold text-on-surface">
                {orderLabel(order)}
              </p>
              <p className="font-label text-xs text-on-surface-variant">
                {formatDateBR(order.createdAt)} · {orderDetail(order)}
              </p>
            </div>
            <Badge tone={STATUS_TONE[order.status] ?? "neutral"}>
              {order.status}
            </Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
};
