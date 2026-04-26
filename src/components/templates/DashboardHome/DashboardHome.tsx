"use client";

import { Button, ClawIndicator, Icon, Spinner } from "@/components/atoms";
import {
  Card,
  ClubProgressList,
  EmptyState,
  SizesDonutChart,
  StatTile,
} from "@/components/molecules";
import { AlertsPanel, StockEntriesTable } from "@/components/organisms";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import type { DashboardStats } from "@/types";

interface DashboardHomeProps {
  greeting: string;
  stats: DashboardStats | undefined;
  isLoading: boolean;
}

export const DashboardHome = ({
  greeting,
  stats,
  isLoading,
}: DashboardHomeProps) => {
  if (isLoading) {
    return (
      <DashboardLayout title="Dashboard" subtitle={`${greeting} Carregando...`}>
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
          <span className="font-label text-xs uppercase tracking-widest text-primary block">
            Visão operacional
          </span>
          DASHBOARD
        </>
      }
      subtitle={`${greeting} Aqui está o pulso da loja agora.`}
      toolbar={
        <div className="flex justify-end">
          <Button type="button">
            <Icon name="add_shopping_cart" size="sm" />
            Registrar nova venda
          </Button>
        </div>
      }
    >
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatTile
          label={stats?.productsInStock.label ?? "Produtos em estoque"}
          value={stats?.productsInStock.formatted ?? "—"}
          delta={stats?.productsInStock.delta}
          trend={stats?.productsInStock.trend}
          iconName="inventory_2"
        />
        <StatTile
          label={stats?.totalRevenue.label ?? "Receita total"}
          value={stats?.totalRevenue.formatted ?? "—"}
          delta={stats?.totalRevenue.delta}
          trend={stats?.totalRevenue.trend}
          iconName="payments"
        />
        <StatTile
          label={stats?.totalSales.label ?? "Total de vendas"}
          value={stats?.totalSales.formatted ?? "—"}
          delta={stats?.totalSales.delta}
          trend={stats?.totalSales.trend}
          iconName="shopping_cart"
        />
        <StatTile
          label={stats?.averageTicket.label ?? "Ticket médio"}
          value={stats?.averageTicket.formatted ?? "—"}
          delta={stats?.averageTicket.delta}
          trend={stats?.averageTicket.trend}
          iconName="trending_up"
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card
            tier="container-high"
            title="Alertas de estoque crítico"
            description="Itens que precisam de reposição imediata"
            action={
              stats ? (
                <span className="font-label text-xs uppercase tracking-wider text-primary">
                  {stats.alerts} críticos
                </span>
              ) : null
            }
          >
            <AlertsPanel inline />
          </Card>
          <Card
            title="Movimentações recentes"
            description="Últimas entradas e saídas"
            action={
              <button
                type="button"
                className="font-label text-xs uppercase tracking-wider text-primary"
              >
                Ver tudo
              </button>
            }
          >
            <StockEntriesTable inline />
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Visão por clube" description="Top 5 do mês">
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
          <Card title="Vendas por tamanho" description="Distribuição">
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
          <Card tier="container-highest">
            <div className="flex items-center gap-3">
              <ClawIndicator level={stats ? 3 : 0} />
              <div>
                <p className="font-headline text-sm font-bold text-on-surface">
                  Status do sistema: {stats ? "Elite" : "Aguardando"}
                </p>
                <p className="font-label text-xs text-on-surface-variant">
                  {stats
                    ? "Sincronizando com tiger.store API"
                    : "Conectando ao backend..."}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
