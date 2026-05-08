"use client";

import { Badge } from "@/components/atoms";
import { Card, EmptyState, SkeletonTableRow } from "@/components/molecules";
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
            <div className="flex items-center gap-2 font-label text-xs text-on-surface-variant">
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
          </div>
        ))}
      </div>
      <div className="hidden md:block overflow-x-auto -mx-4 md:mx-0">
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
    </>
  );

  return wrapInCard(table, {
    title: "Movimentações",
    description: `${entries.length} registros`,
  });
};
