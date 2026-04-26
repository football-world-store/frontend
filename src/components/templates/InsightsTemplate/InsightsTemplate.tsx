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
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { PRICE_CENTS_MULTIPLIER } from "@/constants";
import type { DashboardStats } from "@/types";
import { formatCurrencyBRL } from "@/utils";

interface InsightsTemplateProps {
  stats: DashboardStats | undefined;
  isLoading: boolean;
}

export const InsightsTemplate = ({
  stats,
  isLoading,
}: InsightsTemplateProps) => {
  if (isLoading) {
    return (
      <DashboardLayout title="Central de Insights" subtitle="Carregando...">
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
          CENTRAL DE <span className="text-primary italic">INSIGHTS</span>
        </>
      }
      subtitle="Análise em tempo real da performance do inventário."
    >
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatTile
          label="Lucro total"
          value={
            stats
              ? formatCurrencyBRL(stats.totalProfit * PRICE_CENTS_MULTIPLIER)
              : "—"
          }
          delta={stats ? 12.4 : undefined}
          trend={stats ? "up" : undefined}
          iconName="paid"
        />
        <StatTile
          label="Clube mais vendido"
          value={stats?.bestSellingClub ?? "—"}
          iconName="emoji_events"
        />
        <StatTile
          label="Tamanho mais vendido"
          value={stats?.topPerformanceSize ?? "—"}
          iconName="straighten"
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          className="lg:col-span-2"
          tier="container-high"
          title="Dinâmica de receita — 30D"
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
          {stats ? (
            <RevenueLineChart data={stats.revenueHistory} />
          ) : (
            <EmptyState
              iconName="show_chart"
              title="Sem dados de receita"
              description="Os gráficos aparecerão quando houver vendas registradas."
            />
          )}
        </Card>

        <Card title="Vendas por categoria" description="Distribuição em volume">
          {stats ? (
            <SizesDonutChart data={stats.sizeShares} />
          ) : (
            <EmptyState
              iconName="pie_chart"
              title="Sem dados"
              description="Dados de vendas aparecerão aqui."
            />
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Top 5 Clubes" description="Volume de unidades vendidas">
          {!stats || stats.topClubs.length === 0 ? (
            <EmptyState
              iconName="sports_soccer"
              title="Sem dados"
              description="Vendas aparecerão aqui."
            />
          ) : (
            <ClubProgressList items={stats.topClubs} />
          )}
        </Card>

        <Card
          tier="container-high"
          title="Produtos parados"
          description="Sem vendas há mais de 30 dias"
          action={
            <button
              type="button"
              className="font-label text-xs uppercase tracking-wider text-primary inline-flex items-center gap-1"
            >
              <Icon name="add_circle" size="sm" />
              Adicionar nota
            </button>
          }
        >
          {!stats || stats.slowMovingItems.length === 0 ? (
            <EmptyState
              iconName="inventory_2"
              title="Nenhum produto parado"
              description="Todos os produtos tiveram vendas recentes."
            />
          ) : (
            <ul className="space-y-2">
              {stats.slowMovingItems.map((item, index) => (
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
                  <Badge tone="warning">Remarcar</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};
