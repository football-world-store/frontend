"use client";

import { Card, EmptyState, SkeletonListRow } from "@/components/molecules";
import {
  DEFAULT_DASHBOARD_PERIOD,
  DEFAULT_DASHBOARD_TOP_LIMIT,
} from "@/constants";
import {
  useDashboardChannelsQuery,
  useDashboardTopProductsQuery,
} from "@/hooks/queries";
import { formatPriceFromReais } from "@/utils";

const TOP_LIST_PARAMS = {
  ...DEFAULT_DASHBOARD_PERIOD,
  limit: DEFAULT_DASHBOARD_TOP_LIMIT,
};

export const InsightsPanel = () => {
  const channelsQuery = useDashboardChannelsQuery(DEFAULT_DASHBOARD_PERIOD);
  const topProductsQuery = useDashboardTopProductsQuery(TOP_LIST_PARAMS);

  const isLoading = channelsQuery.isLoading || topProductsQuery.isLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Vendas por canal" description="Distribuição da receita">
          <SkeletonListRow count={4} />
        </Card>
        <Card title="Top produtos" description="Mais vendidos no período">
          <SkeletonListRow count={4} />
        </Card>
      </div>
    );
  }

  const channels = channelsQuery.data ?? [];
  const topProducts = topProductsQuery.data ?? [];

  if (channels.length === 0 && topProducts.length === 0) {
    return (
      <Card title="Performance">
        <EmptyState
          iconName="analytics"
          title="Sem dados ainda"
          description="Os insights aparecerão aqui assim que houver vendas."
        />
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Vendas por canal" description="Distribuição da receita">
        <ul className="space-y-3">
          {channels.map((channel) => (
            <li
              key={channel.channel}
              className="flex items-center justify-between bg-surface-container-low rounded-xl px-4 py-3"
            >
              <span className="font-label uppercase text-xs tracking-wider text-on-surface-variant">
                {channel.channel}
              </span>
              <span className="font-body font-semibold text-on-surface">
                {formatPriceFromReais(channel.totalAmount)}
              </span>
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Top produtos" description="Mais vendidos no período">
        <ul className="space-y-3">
          {topProducts.map((product) => (
            <li
              key={product.id}
              className="flex items-center justify-between bg-surface-container-low rounded-xl px-4 py-3"
            >
              <div>
                <p className="font-body text-sm font-semibold text-on-surface">
                  {product.name}
                </p>
                <p className="font-label text-xs text-on-surface-variant">
                  {product.totalSold} unidades · {product.clubOrBrand}
                </p>
              </div>
              <span className="font-body font-semibold text-primary">
                {formatPriceFromReais(product.totalRevenue)}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};
