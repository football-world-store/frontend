import { Button, Select } from "@/components/atoms";
import type { SaleChannel, SaleStatus } from "@/types";

export interface SalesFilterValues {
  channel: SaleChannel | "";
  status: SaleStatus | "";
  startDate: string;
  endDate: string;
}

interface SalesFilterBarProps {
  filter: SalesFilterValues;
  onChange: (patch: Partial<SalesFilterValues>) => void;
  onReset: () => void;
}

const CHANNEL_OPTIONS = [
  { value: "", label: "Todos os canais" },
  { value: "LOJA_FISICA", label: "Loja física" },
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "SITE", label: "Site" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Todos os status" },
  { value: "CONFIRMED", label: "Confirmada" },
  { value: "CANCELLED", label: "Cancelada" },
];

export const SalesFilterBar = ({
  filter,
  onChange,
  onReset,
}: SalesFilterBarProps) => {
  const activeFilterCount =
    (filter.channel ? 1 : 0) +
    (filter.status ? 1 : 0) +
    (filter.startDate ? 1 : 0) +
    (filter.endDate ? 1 : 0);

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <Select
        options={CHANNEL_OPTIONS}
        value={filter.channel}
        onChange={(e) =>
          onChange({ channel: e.target.value as SalesFilterValues["channel"] })
        }
        className="w-full sm:w-auto sm:min-w-[10rem]"
      />
      <Select
        options={STATUS_OPTIONS}
        value={filter.status}
        onChange={(e) =>
          onChange({ status: e.target.value as SalesFilterValues["status"] })
        }
        className="w-full sm:w-auto sm:min-w-[10rem]"
      />
      <input
        type="date"
        value={filter.startDate}
        onChange={(e) => onChange({ startDate: e.target.value })}
        aria-label="Data inicial"
        className="h-12 px-4 rounded-xl bg-surface-container-lowest text-on-surface text-sm focus-visible:outline-none focus-visible:ring-focus-gold"
      />
      <input
        type="date"
        value={filter.endDate}
        onChange={(e) => onChange({ endDate: e.target.value })}
        aria-label="Data final"
        className="h-12 px-4 rounded-xl bg-surface-container-lowest text-on-surface text-sm focus-visible:outline-none focus-visible:ring-focus-gold"
      />
      {activeFilterCount > 0 ? (
        <Button type="button" variant="ghost" onClick={onReset}>
          Limpar
        </Button>
      ) : null}
    </div>
  );
};
