"use client";

import { Badge, Spinner } from "@/components/atoms";
import { Card, EmptyState } from "@/components/molecules";
import { useStockEntriesQuery } from "@/hooks/queries";
import { formatCurrencyBRL, formatDateBR } from "@/utils";

interface StockEntriesTableProps {
  inline?: boolean;
}

export const StockEntriesTable = ({
  inline = false,
}: StockEntriesTableProps) => {
  const { data, isLoading } = useStockEntriesQuery();

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
    return wrapInCard(
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>,
    );
  }

  if (!data || data.length === 0) {
    return wrapInCard(
      <EmptyState
        iconName="swap_horiz"
        title="Sem entradas registradas"
        description="As movimentações de estoque aparecerão aqui."
      />,
    );
  }

  const table = (
    <div className="rounded-xl overflow-hidden">
      {data.map((entry, index) => (
        <div
          key={entry.id}
          className={`grid grid-cols-12 items-center px-4 py-4 transition-colors hover:bg-surface-bright ${
            index % 2 === 0
              ? "bg-surface-container-low"
              : "bg-surface-container"
          }`}
        >
          <span className="col-span-4 font-body text-sm text-on-surface">
            {entry.productName}
          </span>
          <span className="col-span-2">
            <Badge tone={entry.type === "ENTRY" ? "success" : "warning"}>
              {entry.type === "ENTRY" ? "Entrada" : "Estorno"}
            </Badge>
          </span>
          <span className="col-span-2 font-body text-sm text-on-surface">
            {entry.quantity} un.
          </span>
          <span className="col-span-2 font-body text-sm text-on-surface">
            {formatCurrencyBRL(entry.unitCost * 100)}
          </span>
          <span className="col-span-2 font-label text-xs text-on-surface-variant text-right">
            {formatDateBR(entry.registeredAt)}
          </span>
        </div>
      ))}
    </div>
  );

  return wrapInCard(table, {
    title: "Movimentações",
    description: `${data.length} registros`,
  });
};
