import { Button } from "@/components/atoms";

export interface StockEntriesFilterValues {
  supplier: string;
  startDate: string;
  endDate: string;
}

interface StockEntriesFilterBarProps {
  filter: StockEntriesFilterValues;
  onChange: (patch: Partial<StockEntriesFilterValues>) => void;
  onReset: () => void;
}

export const StockEntriesFilterBar = ({
  filter,
  onChange,
  onReset,
}: StockEntriesFilterBarProps) => {
  const activeFilterCount =
    (filter.supplier ? 1 : 0) +
    (filter.startDate ? 1 : 0) +
    (filter.endDate ? 1 : 0);

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <input
        type="text"
        value={filter.supplier}
        onChange={(e) => onChange({ supplier: e.target.value })}
        placeholder="Fornecedor..."
        className="h-11 px-4 rounded-xl bg-surface-container-lowest text-on-surface text-sm focus-visible:outline-none focus-visible:ring-focus-gold w-full sm:w-auto sm:min-w-[12rem]"
      />
      <input
        type="date"
        value={filter.startDate}
        onChange={(e) => onChange({ startDate: e.target.value })}
        aria-label="Data inicial"
        className="h-11 px-4 rounded-xl bg-surface-container-lowest text-on-surface text-sm focus-visible:outline-none focus-visible:ring-focus-gold"
      />
      <input
        type="date"
        value={filter.endDate}
        onChange={(e) => onChange({ endDate: e.target.value })}
        aria-label="Data final"
        className="h-11 px-4 rounded-xl bg-surface-container-lowest text-on-surface text-sm focus-visible:outline-none focus-visible:ring-focus-gold"
      />
      {activeFilterCount > 0 ? (
        <Button type="button" variant="ghost" onClick={onReset}>
          Limpar
        </Button>
      ) : null}
    </div>
  );
};
