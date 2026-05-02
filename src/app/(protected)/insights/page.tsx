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
      <DashboardLayout title="Centro de Insights" subtitle="Carregando...">
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
        {/* Tradução: "Total Profit" → "Lucro Total" */}
        <StatTile
          label="Lucro Total"
          value={formatCurrencyBRL(data.totalProfit * PRICE_CENTS_MULTIPLIER)}
          delta={12.4}
          trend="up"
          iconName="paid"
        />
        {/* Tradução: "Best Selling Club" → "Clube Mais Vendido" */}
        <StatTile
          label="Clube Mais Vendido"
          value={data.bestSellingClub}
          iconName="emoji_events"
        />
        {/* Tradução: "Top Performance Size" → "Tamanho com Melhor Performance" */}
        <StatTile
          label="Tamanho com Melhor Performance"
          value={data.topPerformanceSize}
          iconName="straighten"
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tradução: "Revenue dynamics — 30D" → "Dinâmica de Receita — 30D" + "Sales" → "Vendas" + "Cost" → "Custo" */}
        <Card
          className="lg:col-span-2"
          tier="container-high"
          title="Dinâmica de Receita — 30D"
          description="Receita vs custo nos últimos 30 dias"
          action={
            <div className="flex items-center gap-3 font-label text-xs uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-primary">
                <span className="block h-2 w-2 rounded-full bg-primary" />
                Vendas
              </span>
              <span className="flex items-center gap-1.5 text-tertiary">
                <span className="block h-2 w-2 rounded-full bg-tertiary" />
                Custo
              </span>
            </div>
          }
        >
          <RevenueLineChart data={data.revenueHistory} />
        </Card>

        {/* Tradução: "Sales by category" → "Vendas por categoria" */}
        <Card title="Vendas por categoria" description="Distribuição em volume">
          <SizesDonutChart data={data.sizeShares} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tradução: "Top 5 Clubs" → "Top 5 Clubes" */}
        <Card title="Top 5 Clubes" description="Volume de unidades vendidas">
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

        {/* Tradução: "Slow-moving items" → "Itens de Movimento Lento" + "Add insight note" → "Adicionar anotação" */}
        <Card
          tier="container-high"
          title="Itens de Movimento Lento"
          description="Sem vendas há mais de 30 dias"
          action={
            <button className="font-label text-xs uppercase tracking-wider text-primary inline-flex items-center gap-1">
              <Icon name="add_circle" size="sm" />
              Adicionar anotação
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
                {/* Tradução: "Mark down" → "Redução de Preço" */}
                <Badge tone="warning">Redução de Preço</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InsightsPage;
