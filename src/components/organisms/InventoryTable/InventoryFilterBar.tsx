import { Badge, Button, Icon, Select } from "@/components/atoms";
import { useDistinctProductValuesQuery } from "@/hooks/queries";
import type { ProductStatus } from "@/types";

export interface InventoryFilterValues {
  clubOrBrand: string;
  size: string;
  status: ProductStatus | "";
}

interface InventoryFilterBarProps {
  filter: InventoryFilterValues;
  includeInactive: boolean;
  onChangeFilter: (patch: Partial<InventoryFilterValues>) => void;
  onChangeIncludeInactive: (value: boolean) => void;
  onReset: () => void;
}

const STATUS_OPTIONS = [
  { value: "", label: "Todos status" },
  { value: "IN_STOCK", label: "Saudável" },
  { value: "CRITICAL", label: "Crítico" },
  { value: "OUT_OF_STOCK", label: "Esgotado" },
  { value: "IDLE", label: "Parado" },
];

const FilterFields = ({
  filter,
  onChangeFilter,
  inputClassName,
  clubOptions,
  sizeOptions,
}: {
  filter: InventoryFilterValues;
  onChangeFilter: InventoryFilterBarProps["onChangeFilter"];
  inputClassName: string;
  clubOptions: string[];
  sizeOptions: string[];
}) => (
  <>
    <>
      <input
        type="text"
        list="club-options"
        value={filter.clubOrBrand}
        onChange={(e) => onChangeFilter({ clubOrBrand: e.target.value })}
        placeholder="Clube / Marca"
        className={inputClassName}
      />
      <datalist id="club-options">
        {clubOptions.map((v) => (
          <option key={v} value={v} />
        ))}
      </datalist>
    </>
    <>
      <input
        type="text"
        list="size-options"
        value={filter.size}
        onChange={(e) => onChangeFilter({ size: e.target.value })}
        placeholder="Tamanho"
        className={inputClassName}
      />
      <datalist id="size-options">
        {sizeOptions.map((v) => (
          <option key={v} value={v} />
        ))}
      </datalist>
    </>
    <Select
      options={STATUS_OPTIONS}
      value={filter.status}
      onChange={(e) =>
        onChangeFilter({
          status: e.target.value as InventoryFilterValues["status"],
        })
      }
    />
  </>
);

export const InventoryFilterBar = ({
  filter,
  includeInactive,
  onChangeFilter,
  onChangeIncludeInactive,
  onReset,
}: InventoryFilterBarProps) => {
  const { data: distinctValues } = useDistinctProductValuesQuery();
  const clubOptions = distinctValues?.clubOrBrand ?? [];
  const sizeOptions = distinctValues?.size ?? [];

  const activeFilterCount =
    (filter.clubOrBrand ? 1 : 0) +
    (filter.size ? 1 : 0) +
    (filter.status ? 1 : 0);

  const inputClass =
    "h-11 px-4 rounded-xl bg-surface-container-lowest text-on-surface text-sm focus-visible:outline-none focus-visible:ring-focus-gold";

  return (
    <div className="mb-6 space-y-3">
      {activeFilterCount > 0 ? (
        <div className="flex justify-end md:hidden">
          <Button type="button" variant="ghost" onClick={onReset}>
            Limpar
          </Button>
        </div>
      ) : null}
      <details className="md:hidden group">
        <summary className="flex h-11 cursor-pointer items-center justify-between rounded-xl bg-surface-container-lowest px-4 font-label text-xs uppercase tracking-wider text-on-surface-variant focus-visible:outline-none focus-visible:ring-focus-gold [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2">
            <Icon name="tune" size="sm" />
            Filtros
            {activeFilterCount > 0 ? (
              <Badge tone="primary">{activeFilterCount}</Badge>
            ) : null}
          </span>
          <Icon
            name="expand_more"
            size="sm"
            className="transition-transform group-open:rotate-180"
          />
        </summary>
        <div className="mt-3 flex flex-col gap-3">
          <FilterFields
            filter={filter}
            onChangeFilter={onChangeFilter}
            inputClassName={`w-full ${inputClass}`}
            clubOptions={clubOptions}
            sizeOptions={sizeOptions}
          />
        </div>
      </details>
      <div className="hidden md:flex gap-3">
        <FilterFields
          filter={filter}
          onChangeFilter={onChangeFilter}
          inputClassName={`w-full max-w-xs ${inputClass}`}
          clubOptions={clubOptions}
          sizeOptions={sizeOptions}
        />
        <Button type="button" variant="ghost" onClick={onReset}>
          Limpar
        </Button>
      </div>
      <label className="flex items-center gap-2 font-label text-xs uppercase tracking-wider text-on-surface-variant cursor-pointer">
        <input
          type="checkbox"
          checked={includeInactive}
          onChange={(event) => onChangeIncludeInactive(event.target.checked)}
          className="h-4 w-4 rounded bg-surface-container-lowest accent-primary focus-visible:outline-none focus-visible:ring-focus-gold"
        />
        Incluir produtos inativos
      </label>
    </div>
  );
};
