"use client";

import { type ReactNode, useState } from "react";

import { Card, SkeletonTableRow } from "@/components/molecules";
import { useDebouncedValue } from "@/hooks";
import { useReverseStockEntryMutation } from "@/hooks/mutations";
import { useStockEntriesQuery } from "@/hooks/queries";

import { ReverseEntryModal } from "./ReverseEntryModal";
import { StockEntriesContent } from "./StockEntriesContent";
import type { StockEntriesFilterValues } from "./StockEntriesFilterBar";

interface StockEntriesTableProps {
  /** Modo resumido (dashboard): sem filtros/paginação, só as últimas entradas. */
  inline?: boolean;
}

const ITEMS_PER_PAGE = 10;
const INLINE_ITEMS_LIMIT = 5;
const REVERSE_REASON_MIN_LENGTH = 5;
const SEARCH_DEBOUNCE_MS = 300;

const EMPTY_FILTER: StockEntriesFilterValues = {
  supplier: "",
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

interface BuildQueryParamsArgs {
  inline: boolean;
  page: number;
  filter: StockEntriesFilterValues;
  debouncedSupplier: string;
}

const buildQueryParams = ({
  inline,
  page,
  filter,
  debouncedSupplier,
}: BuildQueryParamsArgs) => {
  if (inline) {
    return { page: 1, limit: INLINE_ITEMS_LIMIT };
  }
  return {
    page,
    limit: ITEMS_PER_PAGE,
    supplier: debouncedSupplier || undefined,
    startDate: filter.startDate || undefined,
    endDate: filter.endDate || undefined,
  };
};

export const StockEntriesTable = ({
  inline = false,
}: StockEntriesTableProps) => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<StockEntriesFilterValues>(EMPTY_FILTER);
  const debouncedSupplier = useDebouncedValue(
    filter.supplier,
    SEARCH_DEBOUNCE_MS,
  );

  const { data, isLoading } = useStockEntriesQuery(
    buildQueryParams({ inline, page, filter, debouncedSupplier }),
  );
  const entries = data?.items ?? [];
  const reverseMutation = useReverseStockEntryMutation();

  const [pendingReverseId, setPendingReverseId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const pendingEntry = pendingReverseId
    ? (entries.find((entry) => entry.id === pendingReverseId) ?? null)
    : null;

  const closeReverseModal = () => {
    setPendingReverseId(null);
    setReason("");
  };

  const handleConfirmReverse = () => {
    if (!pendingReverseId) return;
    if (reason.trim().length < REVERSE_REASON_MIN_LENGTH) return;
    reverseMutation.mutate(
      { id: pendingReverseId, reason: reason.trim() },
      { onSettled: closeReverseModal },
    );
  };

  const updateFilter = (patch: Partial<StockEntriesFilterValues>) => {
    setFilter((prev) => ({ ...prev, ...patch }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilter(EMPTY_FILTER);
    setPage(1);
  };

  if (isLoading) {
    return wrapInCard(inline, <SkeletonTableRow count={5} cells={5} />, {
      title: "Movimentações",
    });
  }

  return (
    <>
      {wrapInCard(
        inline,
        <StockEntriesContent
          inline={inline}
          data={data}
          page={page}
          filter={filter}
          onFilterChange={updateFilter}
          onFilterReset={resetFilters}
          onPageChange={setPage}
          onReverse={setPendingReverseId}
        />,
        {
          title: "Movimentações",
          description: `${data?.total ?? 0} registros`,
        },
      )}

      <ReverseEntryModal
        entry={pendingEntry}
        reason={reason}
        isPending={reverseMutation.isPending}
        onReasonChange={setReason}
        onClose={closeReverseModal}
        onConfirm={handleConfirmReverse}
      />
    </>
  );
};
