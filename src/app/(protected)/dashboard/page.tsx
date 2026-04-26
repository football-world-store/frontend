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
import { DashboardLayout } from "@/components/templates";
import { useAuth } from "@/contexts";
import { useDashboardStatsQuery } from "@/hooks/queries";

const DashboardPage = () => {
  const { user } = useAuth();
  const { data, isLoading } = useDashboardStatsQuery();
  const greeting = user ? `Olá, ${user.name.split(" ")[0]}.` : "Olá.";

  if (isLoading || !data) {
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
            Operational overview
          </span>
          DASHBOARD
        </>
      }
      subtitle={`${greeting} Aqui está o pulso da loja agora.`}
      toolbar={
        <div className="flex justify-end">
          <Button>
            <Icon name="add_shopping_cart" size="sm" />
            Register new sale
          </Button>
        </div>
      }
    >
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatTile
          label={data.productsInStock.label}
          value={data.productsInStock.formatted}
          delta={data.productsInStock.delta}
          trend={data.productsInStock.trend}
          iconName="inventory_2"
        />
        <StatTile
          label={data.totalRevenue.label}
          value={data.totalRevenue.formatted}
          delta={data.totalRevenue.delta}
          trend={data.totalRevenue.trend}
          iconName="payments"
        />
        <StatTile
          label={data.totalSales.label}
          value={data.totalSales.formatted}
          delta={data.totalSales.delta}
          trend={data.totalSales.trend}
          iconName="shopping_cart"
        />
        <StatTile
          label={data.averageTicket.label}
          value={data.averageTicket.formatted}
          delta={data.averageTicket.delta}
          trend={data.averageTicket.trend}
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
              <span className="font-label text-xs uppercase tracking-wider text-primary">
                {data.alerts} críticos
              </span>
            }
          >
            <AlertsPanel inline />
          </Card>
          <Card
            title="Movimentações recentes"
            description="Últimas entradas e saídas"
            action={
              <button className="font-label text-xs uppercase tracking-wider text-primary">
                Ver tudo
              </button>
            }
          >
            <StockEntriesTable inline />
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Visão por clube" description="Top 5 do mês">
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
          <Card title="Vendas por tamanho" description="Distribuição">
            <SizesDonutChart data={data.sizeShares} />
          </Card>
          <Card tier="container-highest">
            <div className="flex items-center gap-3">
              <ClawIndicator level={3} />
              <div>
                <p className="font-headline text-sm font-bold text-on-surface">
                  System Status: Elite
                </p>
                <p className="font-label text-xs text-on-surface-variant">
                  Sincing with tiger.store API
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
