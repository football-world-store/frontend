"use client";

import { type ReactNode, useState } from "react";

import { Card, SkeletonTableRow } from "@/components/molecules";
import { useCancelSaleMutation } from "@/hooks/mutations";
import { useSalesQuery } from "@/hooks/queries";

import { CancelSaleModal } from "./CancelSaleModal";
import { SalesContent } from "./SalesContent";
import { SalesFilterBar, type SalesFilterValues } from "./SalesFilterBar";

interface SalesTableProps {
  /** Modo resumido (dashboard): sem filtros/paginação, só as últimas vendas. */
  inline?: boolean;
}

const ITEMS_PER_PAGE = 10;
const INLINE_ITEMS_LIMIT = 5;
const CANCEL_REASON_MIN_LENGTH = 5;

const EMPTY_FILTER: SalesFilterValues = {
  channel: "",
  status: "",
  startDate: "",
  endDate: "",
};

const wrapInCard = (
  inline: boolean,
  children: ReactNode,
  props: { title: string; description?: string },
) =>
  inline ? (
    <>{children}</>
  ) : (
    <Card title={props.title} description={props.description}>
      {children}
    </Card>
  );

export const SalesTable = ({ inline = false }: SalesTableProps) => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<SalesFilterValues>(EMPTY_FILTER);

  const { data, isLoading } = useSalesQuery(
    inline
      ? { page: 1, limit: INLINE_ITEMS_LIMIT }
      : {
          page,
          limit: ITEMS_PER_PAGE,
          channel: filter.channel || undefined,
          status: filter.status || undefined,
          startDate: filter.startDate || undefined,
          endDate: filter.endDate || undefined,
        },
  );
  const sales = data?.items ?? [];
  const cancelMutation = useCancelSaleMutation();

  const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const pendingSale = pendingCancelId
    ? (sales.find((sale) => sale.id === pendingCancelId) ?? null)
    : null;

  const closeCancelModal = () => {
    setPendingCancelId(null);
    setCancelReason("");
  };

  const handleConfirmCancel = () => {
    if (!pendingCancelId) return;
    if (cancelReason.trim().length < CANCEL_REASON_MIN_LENGTH) return;
    cancelMutation.mutate(
      { id: pendingCancelId, cancelReason: cancelReason.trim() },
      { onSettled: closeCancelModal },
    );
  };

  const updateFilter = (patch: Partial<SalesFilterValues>) => {
    setFilter((prev) => ({ ...prev, ...patch }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilter(EMPTY_FILTER);
    setPage(1);
  };

  if (isLoading) {
    return wrapInCard(inline, <SkeletonTableRow count={5} cells={6} />, {
      title: "Vendas",
      description: "Histórico completo",
    });
  }

  return (
    <>
      {wrapInCard(
        inline,
        <>
          {inline ? null : (
            <SalesFilterBar
              filter={filter}
              onChange={updateFilter}
              onReset={resetFilters}
            />
          )}
          <SalesContent
            inline={inline}
            data={data}
            page={page}
            onPageChange={setPage}
            onCancel={setPendingCancelId}
          />
        </>,
        {
          title: "Vendas",
          description: `${data?.total ?? 0} registros`,
        },
      )}

      <CancelSaleModal
        sale={pendingSale}
        reason={cancelReason}
        isPending={cancelMutation.isPending}
        onReasonChange={setCancelReason}
        onClose={closeCancelModal}
        onConfirm={handleConfirmCancel}
      />
    </>
  );
};
