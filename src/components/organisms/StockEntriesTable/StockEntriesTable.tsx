"use client";

import { Badge, Spinner } from "@/components/atoms";
import { Card, EmptyState } from "@/components/molecules";
import { useStockEntriesQuery } from "@/hooks/queries";
import { formatDateBR, formatPriceFromReais } from "@/utils";

interface StockEntriesTableProps {
  inline?: boolean;
}

export const StockEntriesTable = ({
  inline = false,
}: StockEntriesTableProps) => {
  const { data, isLoading } = useStockEntriesQuery();
  const entries = data?.items ?? [];

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

  if (entries.length === 0) {
    return wrapInCard(
      <EmptyState
        iconName="swap_horiz"
        title="Sem entradas registradas"
        description="As movimentações de estoque aparecerão aqui."
      />,
    );
  }

  const table = (
    <div className="overflow-x-auto -mx-4 md:mx-0">
      <div className="min-w-[500px] rounded-xl overflow-hidden">
        {entries.map((entry, index) => (
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
          </div>
        ))}
      </div>
    </div>
  );

  return wrapInCard(table, {
    title: "Movimentações",
    description: `${entries.length} registros`,
  });
};
