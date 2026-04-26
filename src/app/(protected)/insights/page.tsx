"use client";

import { Badge, Icon, Spinner } from "@/components/atoms";
import {
  Card,
  ClubProgressList,
  EmptyState,
  RevenueLineChart,
  SizesDonutChart,
  StatTile,
} from "@/components/molecules";
import { DashboardLayout } from "@/components/templates";
import { useDashboardStatsQuery } from "@/hooks/queries";
import { formatCurrencyBRL } from "@/utils";

const PRICE_CENTS_MULTIPLIER = 100;

const InsightsPage = () => {
  const { data, isLoading } = useDashboardStatsQuery();

  if (isLoading || !data) {
    return (
      <DashboardLayout title="Insights center" subtitle="Carregando...">
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={
        <>
          INSIGHTS <span className="text-primary italic">CENTER</span>
        </>
      }
      subtitle="Análise em tempo real da performance do inventário."
    >
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatTile
          label="Total Profit"
          value={formatCurrencyBRL(data.totalProfit * PRICE_CENTS_MULTIPLIER)}
          delta={12.4}
          trend="up"
          iconName="paid"
        />
        <StatTile
          label="Best Selling Club"
          value={data.bestSellingClub}
          iconName="emoji_events"
        />
        <StatTile
          label="Top Performance Size"
          value={data.topPerformanceSize}
          iconName="straighten"
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          className="lg:col-span-2"
          tier="container-high"
          title="Revenue dynamics — 30D"
          description="Receita vs custo nos últimos 30 dias"
          action={
            <div className="flex items-center gap-3 font-label text-xs uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-primary">
                <span className="block h-2 w-2 rounded-full bg-primary" />
                Sales
              </span>
              <span className="flex items-center gap-1.5 text-tertiary">
                <span className="block h-2 w-2 rounded-full bg-tertiary" />
                Cost
              </span>
            </div>
          }
        >
          <RevenueLineChart data={data.revenueHistory} />
        </Card>

        <Card title="Sales by category" description="Distribuição em volume">
          <SizesDonutChart data={data.sizeShares} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Top 5 Clubs" description="Volume de unidades vendidas">
          {data.topClubs.length === 0 ? (
            <EmptyState
              iconName="sports_soccer"
              title="Sem dados"
              description="Vendas aparecerão aqui."
            />
          ) : (
            <ClubProgressList items={data.topClubs} />
          )}
        </Card>

        <Card
          tier="container-high"
          title="Slow-moving items"
          description="Sem vendas há mais de 30 dias"
          action={
            <button className="font-label text-xs uppercase tracking-wider text-primary inline-flex items-center gap-1">
              <Icon name="add_circle" size="sm" />
              Add insight note
            </button>
          }
        >
          <ul className="space-y-2">
            {data.slowMovingItems.map((item, index) => (
              <li
                key={item.productId}
                className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 ${
                  index % 2 === 0
                    ? "bg-surface-container-low"
                    : "bg-surface-container"
                }`}
              >
                <div>
                  <p className="font-body text-sm font-semibold text-on-surface">
                    {item.productName}
                  </p>
                  <p className="font-label text-xs text-on-surface-variant">
                    {item.daysWithoutSale} dias sem venda · {item.quantity} em
                    estoque
                  </p>
                </div>
                <Badge tone="warning">Mark down</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InsightsPage;
