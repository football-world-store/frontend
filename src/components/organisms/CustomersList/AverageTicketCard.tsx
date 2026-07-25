import { Select } from "@/components/atoms";
import { Card } from "@/components/molecules";
import type { DashboardPeriodKind } from "@/types";
import { formatCurrencyBRL } from "@/utils";

const PRICE_CENTS_MULTIPLIER = 100;

type PeriodValue = DashboardPeriodKind | "CUSTOM";

const PERIOD_OPTIONS: { value: PeriodValue; label: string }[] = [
  { value: "TODAY", label: "Hoje" },
  { value: "LAST_7_DAYS", label: "Últimos 7 dias" },
  { value: "LAST_30_DAYS", label: "Últimos 30 dias" },
  { value: "CURRENT_MONTH", label: "Este mês" },
  { value: "CUSTOM", label: "Período personalizado" },
];

interface AverageTicketCardProps {
  period: PeriodValue;
  onPeriodChange: (period: PeriodValue) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  averageTicket: number;
}

export const AverageTicketCard = ({
  period,
  onPeriodChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  averageTicket,
}: AverageTicketCardProps) => (
  <Card title="Ticket médio">
    <strong className="font-headline text-3xl font-extrabold text-on-surface block">
      {formatCurrencyBRL(averageTicket * PRICE_CENTS_MULTIPLIER)}
    </strong>
    <p className="font-label text-xs text-on-surface-variant mt-1 mb-4">
      Vendas confirmadas no período
    </p>

    <Select
      options={PERIOD_OPTIONS}
      value={period}
      onChange={(e) => onPeriodChange(e.target.value as PeriodValue)}
      aria-label="Período do ticket médio"
    />

    {period === "CUSTOM" ? (
      <div className="flex items-center gap-2 mt-3">
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          aria-label="Data inicial"
          className="h-11 px-3 rounded-xl bg-surface-container-lowest text-on-surface text-sm focus-visible:outline-none focus-visible:ring-focus-gold flex-1 min-w-0"
        />
        <span className="text-on-surface-variant text-sm">–</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          aria-label="Data final"
          className="h-11 px-3 rounded-xl bg-surface-container-lowest text-on-surface text-sm focus-visible:outline-none focus-visible:ring-focus-gold flex-1 min-w-0"
        />
      </div>
    ) : null}
  </Card>
);
