import { EmptyState, Pagination } from "@/components/molecules";
import type { PaginatedResult, StockEntry } from "@/types";

import {
  StockEntriesFilterBar,
  type StockEntriesFilterValues,
} from "./StockEntriesFilterBar";
import { StockEntryRowDesktop, StockEntryRowMobile } from "./StockEntryRow";

interface StockEntriesContentProps {
  inline: boolean;
  data: PaginatedResult<StockEntry> | undefined;
  page: number;
  filter: StockEntriesFilterValues;
  onFilterChange: (patch: Partial<StockEntriesFilterValues>) => void;
  onFilterReset: () => void;
  onPageChange: (page: number) => void;
  onReverse: (id: string) => void;
}

export const StockEntriesContent = ({
  inline,
  data,
  page,
  filter,
  onFilterChange,
  onFilterReset,
  onPageChange,
  onReverse,
}: StockEntriesContentProps) => {
  const entries = data?.items ?? [];

  return (
    <>
      {inline ? null : (
        <StockEntriesFilterBar
          filter={filter}
          onChange={onFilterChange}
          onReset={onFilterReset}
        />
      )}
      {entries.length === 0 ? (
        <EmptyState
          iconName="swap_horiz"
          title="Nenhuma entrada encontrada"
          description="Ajuste os filtros ou registre uma nova entrada."
        />
      ) : (
        <>
          <div className="md:hidden flex flex-col gap-2 rounded-xl overflow-hidden">
            {entries.map((entry, index) => (
              <StockEntryRowMobile
                key={entry.id}
                entry={entry}
                index={index}
                onReverse={onReverse}
              />
            ))}
          </div>
          <div className="hidden md:block overflow-x-auto -mx-4 md:mx-0">
            <div className="min-w-[640px] rounded-xl overflow-hidden">
              {entries.map((entry, index) => (
                <StockEntryRowDesktop
                  key={entry.id}
                  entry={entry}
                  index={index}
                  onReverse={onReverse}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {inline ? null : (
        <Pagination
          page={page}
          totalPages={data?.totalPages ?? 1}
          total={data?.total ?? 0}
          itemCount={entries.length}
          itemLabel="movimentações"
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};
