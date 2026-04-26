"use client";

import { Spinner } from "@/components/atoms";
import { Card, EmptyState } from "@/components/molecules";
import { useDashboardStatsQuery } from "@/hooks/queries";
import { formatCurrencyBRL } from "@/utils";

export const InsightsPanel = () => {
  const { data, isLoading } = useDashboardStatsQuery();

  if (isLoading) {
    return (
      <Card title="Performance">
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card title="Performance">
        <EmptyState
          iconName="analytics"
          title="Sem dados ainda"
          description="Os insights de performance aparecerão aqui assim que houver vendas."
        />
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Vendas por canal" description="Distribuição da receita">
        <ul className="space-y-3">
          {data.salesByChannel.map((channel) => (
            <li
              key={channel.channel}
              className="flex items-center justify-between bg-surface-container-low rounded-xl px-4 py-3"
            >
              <span className="font-label uppercase text-xs tracking-wider text-on-surface-variant">
                {channel.channel}
              </span>
              <span className="font-body font-semibold text-on-surface">
                {formatCurrencyBRL(channel.total * 100)}
              </span>
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Top produtos" description="Mais vendidos no período">
        <ul className="space-y-3">
          {data.topProducts.map((product) => (
            <li
              key={product.productId}
              className="flex items-center justify-between bg-surface-container-low rounded-xl px-4 py-3"
            >
              <div>
                <p className="font-body text-sm font-semibold text-on-surface">
                  {product.productName}
                </p>
                <p className="font-label text-xs text-on-surface-variant">
                  {product.soldQuantity} unidades
                </p>
              </div>
              <span className="font-body font-semibold text-primary">
                {formatCurrencyBRL(product.revenue * 100)}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};
