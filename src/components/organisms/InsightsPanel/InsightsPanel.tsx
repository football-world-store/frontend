"use client";

import { Icon } from "@/components/atoms";
import { Card, EmptyState, SkeletonListRow } from "@/components/molecules";
import { DEFAULT_DASHBOARD_TOP_LIMIT } from "@/constants";
import {
  useDashboardChannelsQuery,
  useDashboardPaymentMethodsQuery,
  useDashboardTopProductsQuery,
} from "@/hooks/queries";
import type { DashboardPeriod } from "@/types";
import { formatPriceFromReais } from "@/utils";

const CHANNEL_CONFIG: Record<string, { label: string; icon: string }> = {
  SITE: { label: "Site", icon: "language" },
  LOJA_FISICA: { label: "Loja Física", icon: "storefront" },
  WHATSAPP: { label: "WhatsApp", icon: "chat" },
  INSTAGRAM: { label: "Instagram", icon: "photo_camera" },
  MARKETPLACE: { label: "Marketplace", icon: "local_mall" },
};

const PAYMENT_CONFIG: Record<string, { label: string; icon: string }> = {
  PIX: { label: "Pix", icon: "pix" },
  CREDITO: { label: "Crédito", icon: "credit_card" },
  DEBITO: { label: "Débito", icon: "payment" },
  DINHEIRO: { label: "Dinheiro", icon: "payments" },
  BOLETO: { label: "Boleto", icon: "description" },
};

interface InsightsPanelProps {
  period: DashboardPeriod;
}

export const InsightsPanel = ({ period }: InsightsPanelProps) => {
  const topListParams = { ...period, limit: DEFAULT_DASHBOARD_TOP_LIMIT };

  const channelsQuery = useDashboardChannelsQuery(period);
  const topProductsQuery = useDashboardTopProductsQuery(topListParams);
  const paymentMethodsQuery = useDashboardPaymentMethodsQuery(period);

  const isLoading =
    channelsQuery.isLoading ||
    topProductsQuery.isLoading ||
    paymentMethodsQuery.isLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Canais de venda" description="Distribuição da receita">
          <SkeletonListRow count={4} />
        </Card>
        <Card title="Top produtos" description="Mais vendidos no período">
          <SkeletonListRow count={6} />
        </Card>
        <Card title="Formas de pagamento" description="Volume por método">
          <SkeletonListRow count={4} />
        </Card>
      </div>
    );
  }

  const channels = channelsQuery.data ?? [];
  const topProducts = (topProductsQuery.data ?? []).slice(0, 8);
  const paymentMethods = paymentMethodsQuery.data ?? [];
  const maxProductRevenue = topProducts.reduce(
    (acc, p) => Math.max(acc, p.totalRevenue),
    0,
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card title="Canais de venda" description="Distribuição da receita">
        {channels.length === 0 ? (
          <EmptyState
            iconName="bar_chart"
            title="Sem vendas"
            description="Nenhuma venda no período."
          />
        ) : (
          <ul className="space-y-4">
            {channels.map((ch) => {
              const config = CHANNEL_CONFIG[ch.channel] ?? {
                label: ch.channel,
                icon: "point_of_sale",
              };
              return (
                <li key={ch.channel}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-2">
                      <Icon
                        name={config.icon}
                        size="sm"
                        className="text-primary"
                      />
                      <span className="font-label text-xs uppercase tracking-wider text-on-surface">
                        {config.label}
                      </span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-label text-[10px] text-on-surface-variant">
                        {ch.saleCount} vendas
                      </span>
                      <span className="font-body text-sm font-semibold text-on-surface">
                        {formatPriceFromReais(ch.totalAmount)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-surface-container-low rounded-pill overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-pill transition-all duration-500"
                        style={{ width: `${ch.percentage}%` }}
                      />
                    </div>
                    <span className="font-label text-xs text-on-surface-variant w-8 text-right">
                      {Math.round(ch.percentage)}%
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card title="Top produtos" description="Mais vendidos no período">
        {topProducts.length === 0 ? (
          <EmptyState
            iconName="emoji_events"
            title="Sem dados"
            description="Nenhuma venda no período."
          />
        ) : (
          <ol className="space-y-3">
            {topProducts.map((product, index) => (
              <li key={product.id} className="flex items-center gap-3">
                <span
                  className={`h-6 w-6 flex-shrink-0 rounded-full flex items-center justify-center font-label text-[10px] font-bold ${
                    index === 0
                      ? "bg-metallic text-on-primary"
                      : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-body text-sm font-semibold text-on-surface truncate">
                      {product.name}
                    </p>
                    <span className="font-body text-xs font-semibold text-primary flex-shrink-0">
                      {formatPriceFromReais(product.totalRevenue)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-surface-container-low rounded-pill overflow-hidden">
                      <div
                        className="h-full bg-primary/50 rounded-pill transition-all duration-500"
                        style={{
                          width:
                            maxProductRevenue > 0
                              ? `${(product.totalRevenue / maxProductRevenue) * 100}%`
                              : "0%",
                        }}
                      />
                    </div>
                    <span className="font-label text-[10px] text-on-surface-variant flex-shrink-0">
                      {product.totalSold} un.
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </Card>

      <Card title="Formas de pagamento" description="Volume por método">
        {paymentMethods.length === 0 ? (
          <EmptyState
            iconName="credit_card"
            title="Sem pagamentos"
            description="Nenhuma venda no período."
          />
        ) : (
          <ul className="space-y-4">
            {paymentMethods.map((pm) => {
              const config = PAYMENT_CONFIG[pm.method] ?? {
                label: pm.method,
                icon: "credit_card",
              };
              return (
                <li key={pm.method}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-2">
                      <Icon
                        name={config.icon}
                        size="sm"
                        className="text-tertiary"
                      />
                      <span className="font-label text-xs uppercase tracking-wider text-on-surface">
                        {config.label}
                      </span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-label text-[10px] text-on-surface-variant">
                        {pm.saleCount} vendas
                      </span>
                      <span className="font-body text-sm font-semibold text-on-surface">
                        {formatPriceFromReais(pm.totalAmount)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-surface-container-low rounded-pill overflow-hidden">
                      <div
                        className="h-full bg-tertiary rounded-pill transition-all duration-500"
                        style={{ width: `${pm.percentage}%` }}
                      />
                    </div>
                    <span className="font-label text-xs text-on-surface-variant w-8 text-right">
                      {Math.round(pm.percentage)}%
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
};
