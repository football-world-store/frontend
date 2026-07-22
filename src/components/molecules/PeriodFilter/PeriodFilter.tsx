import type { DashboardPeriodKind } from "@/types";

const OPTIONS: { value: DashboardPeriodKind; label: string }[] = [
  { value: "TODAY", label: "Hoje" },
  { value: "LAST_7_DAYS", label: "7 dias" },
  { value: "LAST_30_DAYS", label: "30 dias" },
  { value: "CURRENT_MONTH", label: "Este mês" },
];

interface PeriodFilterProps {
  value: DashboardPeriodKind;
  onChange: (value: DashboardPeriodKind) => void;
}

export const PeriodFilter = ({ value, onChange }: PeriodFilterProps) => (
  <div className="flex gap-2 flex-wrap">
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
  </div>
);
