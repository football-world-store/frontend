export type TabKey = "all" | "active" | "vip";

interface CustomerTabsProps {
  tab: TabKey;
  onChange: (tab: TabKey) => void;
}

const TAB_OPTIONS: { key: TabKey; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "active", label: "Ativos" },
  { key: "vip", label: "VIP" },
];

export const CustomerTabs = ({ tab, onChange }: CustomerTabsProps) => (
  <div className="flex gap-2">
    {TAB_OPTIONS.map((option) => (
      <button
        key={option.key}
        type="button"
        onClick={() => onChange(option.key)}
        aria-pressed={tab === option.key}
        className={`rounded-pill px-4 py-2 font-label text-xs uppercase tracking-wider font-semibold transition-colors focus-visible:outline-none focus-visible:ring-focus-gold ${
          tab === option.key
            ? "bg-metallic text-on-primary"
            : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
);
