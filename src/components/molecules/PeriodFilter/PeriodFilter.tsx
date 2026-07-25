import type { PeriodFilterKind } from "@/hooks";

const OPTIONS: { value: PeriodFilterKind; label: string }[] = [
  { value: "TODAY", label: "Hoje" },
  { value: "LAST_7_DAYS", label: "7 dias" },
  { value: "LAST_30_DAYS", label: "30 dias" },
  { value: "CURRENT_MONTH", label: "Este mês" },
  { value: "CUSTOM", label: "Personalizado" },
];

interface PeriodFilterProps {
  value: PeriodFilterKind;
  onChange: (value: PeriodFilterKind) => void;
  startDate?: string;
  endDate?: string;
  onStartDateChange?: (value: string) => void;
  onEndDateChange?: (value: string) => void;
}

export const PeriodFilter = ({
  value,
  onChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: PeriodFilterProps) => (
  <div className="flex items-center gap-2 flex-wrap">
    {OPTIONS.map((opt) => (
      <button
        key={opt.value}
        type="button"
        onClick={() => onChange(opt.value)}
        aria-pressed={value === opt.value}
        className={`h-9 px-4 rounded-pill font-label text-xs uppercase tracking-wider font-semibold transition-colors focus-visible:outline-none focus-visible:ring-focus-gold ${
          value === opt.value
            ? "bg-metallic text-on-primary"
            : "bg-surface-container-lowest text-on-surface-variant hover:text-on-surface"
        }`}
      >
        {opt.label}
      </button>
    ))}

    {value === "CUSTOM" && onStartDateChange && onEndDateChange ? (
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={startDate ?? ""}
          onChange={(e) => onStartDateChange(e.target.value)}
          aria-label="Data inicial"
          className="h-9 px-3 rounded-xl bg-surface-container-lowest text-on-surface text-xs focus-visible:outline-none focus-visible:ring-focus-gold"
        />
        <span className="text-on-surface-variant text-xs">–</span>
        <input
          type="date"
          value={endDate ?? ""}
          onChange={(e) => onEndDateChange(e.target.value)}
          aria-label="Data final"
          className="h-9 px-3 rounded-xl bg-surface-container-lowest text-on-surface text-xs focus-visible:outline-none focus-visible:ring-focus-gold"
        />
      </div>
    ) : null}
  </div>
);
