"use client";

import { Badge } from "@/components/atoms";
import { Card, EmptyState, SkeletonListRow } from "@/components/molecules";
import { useCustomerPurchasesQuery } from "@/hooks/queries";
import { formatDateBR, formatPriceFromReais, zebraRowTier } from "@/utils";

interface CustomerPurchasesCardProps {
  customerId: string;
}

const SALE_STATUS_TONE: Record<string, "success" | "neutral" | "error"> = {
  CONFIRMED: "success",
  CANCELLED: "error",
};

export const CustomerPurchasesCard = ({
  customerId,
}: CustomerPurchasesCardProps) => {
  const { data, isLoading } = useCustomerPurchasesQuery(customerId);
  const purchases = data?.data ?? [];

  const renderContent = () => {
    if (isLoading) return <SkeletonListRow count={3} />;
    if (purchases.length === 0) {
      return (
        <EmptyState
          iconName="shopping_bag"
          title="Nenhuma compra encontrada"
          description="As compras deste cliente aparecerão aqui."
        />
      );
    }
    return (
      <ul className="space-y-2">
        {purchases.map((purchase, index) => (
          <li
            key={purchase.id}
            className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3 ${zebraRowTier(index)}`}
          >
            <div className="min-w-0">
              <p className="font-body text-sm font-semibold text-on-surface">
                Pedido #{purchase.saleNumber}
              </p>
              <p className="font-label text-xs text-on-surface-variant">
                {formatDateBR(purchase.saleDate)} · {purchase.itemCount}{" "}
                {purchase.itemCount === 1 ? "item" : "itens"} ·{" "}
                {formatPriceFromReais(purchase.totalAmount)}
              </p>
            </div>
            <Badge tone={SALE_STATUS_TONE[purchase.status] ?? "neutral"}>
              {purchase.status}
            </Badge>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card title="Histórico de compras" description="Pedidos anteriores">
      {renderContent()}
    </Card>
  );
};
