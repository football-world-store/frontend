import { Avatar } from "@/components/atoms";
import { Card } from "@/components/molecules";
import type { CustomerRankingEntry } from "@/types";
import { formatCurrencyBRL } from "@/utils";

const PRICE_CENTS_MULTIPLIER = 100;

interface RankingCardProps {
  ranking: CustomerRankingEntry[];
}

export const RankingCard = ({ ranking }: RankingCardProps) => (
  <Card
    tier="container-highest"
    title="Ranking de Elite"
    description="Top 3 do faturamento"
  >
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
              {customer.purchaseCount} pedidos
            </p>
          </div>
          <span className="font-body text-sm font-semibold text-primary">
            {formatCurrencyBRL(customer.totalSpent * PRICE_CENTS_MULTIPLIER)}
          </span>
        </li>
      ))}
    </ol>
  </Card>
);
