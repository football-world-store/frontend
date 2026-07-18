import { Badge, Button, Icon, Select } from "@/components/atoms";
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
}: {
  filter: InventoryFilterValues;
  onChangeFilter: InventoryFilterBarProps["onChangeFilter"];
  inputClassName: string;
}) => (
  <>
    <input
      type="text"
      value={filter.clubOrBrand}
      onChange={(e) => onChangeFilter({ clubOrBrand: e.target.value })}
      placeholder="Clube / Marca"
      className={inputClassName}
    />
    <input
      type="text"
      value={filter.size}
      onChange={(e) => onChangeFilter({ size: e.target.value })}
      placeholder="Tamanho"
      className={inputClassName}
    />
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
          />
        </div>
      </details>
      <div className="hidden md:flex gap-3">
        <FilterFields
          filter={filter}
          onChangeFilter={onChangeFilter}
          inputClassName={`w-full max-w-xs ${inputClass}`}
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
