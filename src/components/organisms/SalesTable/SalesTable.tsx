"use client";

import { useState } from "react";

import { Card, SkeletonTableRow } from "@/components/molecules";
import { useCancelSaleMutation } from "@/hooks/mutations";
import { useSalesQuery } from "@/hooks/queries";

import { CancelSaleModal } from "./CancelSaleModal";
import { SalesContent } from "./SalesContent";
import { SalesFilterBar, type SalesFilterValues } from "./SalesFilterBar";

const ITEMS_PER_PAGE = 10;
const CANCEL_REASON_MIN_LENGTH = 5;

const EMPTY_FILTER: SalesFilterValues = {
  channel: "",
  status: "",
  startDate: "",
  endDate: "",
};

export const SalesTable = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<SalesFilterValues>(EMPTY_FILTER);

  const { data, isLoading } = useSalesQuery({
    page,
    limit: ITEMS_PER_PAGE,
    channel: filter.channel || undefined,
    status: filter.status || undefined,
    startDate: filter.startDate || undefined,
    endDate: filter.endDate || undefined,
  });
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
    return (
      <Card title="Vendas" description="Histórico completo">
        <SkeletonTableRow count={6} cells={6} />
      </Card>
    );
  }

  return (
    <>
      <Card title="Vendas" description={`${data?.total ?? 0} registros`}>
        <SalesFilterBar
          filter={filter}
          onChange={updateFilter}
          onReset={resetFilters}
        />
        <SalesContent
          data={data}
          page={page}
          onPageChange={setPage}
          onCancel={setPendingCancelId}
        />
      </Card>

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
