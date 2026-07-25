import { Avatar } from "@/components/atoms";
import { Card } from "@/components/molecules";
import type { CustomerRankingEntry } from "@/types";
import { formatCurrencyBRL } from "@/utils";

const PRICE_CENTS_MULTIPLIER = 100;

export type RankingMetric = "amount" | "purchases";

const METRIC_DESCRIPTION: Record<RankingMetric, string> = {
  amount: "Top 3 do faturamento",
  purchases: "Top 3 em número de compras",
};

const METRIC_TABS: { key: RankingMetric; label: string }[] = [
  { key: "amount", label: "Faturamento" },
  { key: "purchases", label: "Compras" },
];

interface RankingCardProps {
  ranking: CustomerRankingEntry[];
  metric: RankingMetric;
  onMetricChange: (metric: RankingMetric) => void;
}

const HighlightValue = ({
  customer,
  metric,
}: {
  customer: CustomerRankingEntry;
  metric: RankingMetric;
}) =>
  metric === "amount" ? (
    <span className="font-body text-sm font-semibold text-primary">
      {formatCurrencyBRL(customer.totalSpent * PRICE_CENTS_MULTIPLIER)}
    </span>
  ) : (
    <span className="font-body text-sm font-semibold text-primary">
      {customer.purchaseCount} pedidos
    </span>
  );

export const RankingCard = ({
  ranking,
  metric,
  onMetricChange,
}: RankingCardProps) => (
  <Card
    tier="container-highest"
    title="Ranking de Elite"
    description={METRIC_DESCRIPTION[metric]}
  >
    <div className="mb-3 flex gap-2">
      {METRIC_TABS.map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => onMetricChange(option.key)}
          aria-pressed={metric === option.key}
          className={`rounded-pill px-3 py-1.5 font-label text-xs uppercase tracking-wider font-semibold transition-colors focus-visible:outline-none focus-visible:ring-focus-gold ${
            metric === option.key
              ? "bg-metallic text-on-primary"
              : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
    <ol className="space-y-3">
      {ranking.length === 0 ? (
        <li className="font-label text-xs text-on-surface-variant">
          Sem dados suficientes.
        </li>
      ) : null}
      {ranking.map((customer, index) => (
        <li
          key={customer.id}
          className="flex items-center gap-3 bg-surface-container-low rounded-xl px-3 py-3"
        >
          <span className="font-headline text-2xl font-extrabold text-primary w-8">
            {index + 1}
          </span>
          <Avatar name={customer.name} />
          <div className="flex-1">
            <p className="font-body text-sm font-semibold text-on-surface">
              {customer.name}
            </p>
            <p className="font-label text-xs text-on-surface-variant">
              {metric === "amount"
                ? `${customer.purchaseCount} pedidos`
                : formatCurrencyBRL(
                    customer.totalSpent * PRICE_CENTS_MULTIPLIER,
                  )}
            </p>
          </div>
          <HighlightValue customer={customer} metric={metric} />
        </li>
      ))}
    </ol>
  </Card>
);
