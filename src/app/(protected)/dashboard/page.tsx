"use client";

import { useMemo } from "react";

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
import {
  DEFAULT_DASHBOARD_PERIOD,
  DEFAULT_DASHBOARD_TOP_LIMIT,
} from "@/constants";
import { useAuth } from "@/contexts";
import {
  useAlertsCountQuery,
  useDashboardSizesQuery,
  useDashboardSummaryQuery,
  useDashboardTopClubsQuery,
} from "@/hooks/queries";
import { formatPriceFromReais } from "@/utils";

const TOP_LIST_PARAMS = {
  ...DEFAULT_DASHBOARD_PERIOD,
  limit: DEFAULT_DASHBOARD_TOP_LIMIT,
};

const DashboardPage = () => {
  const { user } = useAuth();
  const summaryQuery = useDashboardSummaryQuery(DEFAULT_DASHBOARD_PERIOD);
  const topClubsQuery = useDashboardTopClubsQuery(TOP_LIST_PARAMS);
  const sizesQuery = useDashboardSizesQuery(DEFAULT_DASHBOARD_PERIOD);
  const alertsCountQuery = useAlertsCountQuery();

  const greeting = user ? `Olá, ${user.name.split(" ")[0]}.` : "Olá.";

  const clubItems = useMemo(() => {
    const top = topClubsQuery.data ?? [];
    const maxSold = top.reduce((acc, c) => Math.max(acc, c.totalSold), 0);
    return top.slice(0, 5).map((c) => ({
      name: c.clubOrBrand,
      units: c.totalSold,
      percentage: maxSold > 0 ? Math.round((c.totalSold / maxSold) * 100) : 0,
    }));
  }, [topClubsQuery.data]);

  const sizeShares = useMemo(() => {
    const top5 = sizesQuery.data?.top5 ?? [];
    const total = top5.reduce((acc, s) => acc + s.totalSold, 0);
    return top5.map((s) => ({
      size: s.size,
      percentage: total > 0 ? Math.round((s.totalSold / total) * 100) : 0,
    }));
  }, [sizesQuery.data]);

  if (summaryQuery.isLoading || !summaryQuery.data) {
    return (
      <DashboardLayout title="Dashboard" subtitle={`${greeting} Carregando...`}>
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const { stock, sales } = summaryQuery.data;

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
          <Button className="w-full md:w-auto">
            <Icon name="add_shopping_cart" size="sm" />
            Registrar nova venda
          </Button>
        </div>
      }
    >
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatTile
          label="Em estoque"
          value={stock.totalItems.toLocaleString("pt-BR")}
          iconName="inventory_2"
        />
        <StatTile
          label="Receita do período"
          value={formatPriceFromReais(sales.totalAmount)}
          iconName="payments"
        />
        <StatTile
          label="Vendas no período"
          value={sales.count.toLocaleString("pt-BR")}
          iconName="shopping_cart"
        />
        <StatTile
          label="Ticket médio"
          value={formatPriceFromReais(sales.averageTicket)}
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
              <span className="font-label text-xs uppercase tracking-wider text-error">
                {alertsCountQuery.data?.critical ?? 0} críticos
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
          <Card title="Visão por clube" description="Top 5 do período">
            {clubItems.length === 0 ? (
              <EmptyState
                iconName="sports_soccer"
                title="Sem dados"
                description="Vendas aparecerão aqui."
              />
            ) : (
              <ClubProgressList items={clubItems} />
            )}
          </Card>
          <Card title="Vendas por tamanho" description="Distribuição">
            <SizesDonutChart data={sizeShares} />
          </Card>
          <Card tier="container-highest">
            <div className="flex items-center gap-3">
              <ClawIndicator level={3} />
              <div>
                <p className="font-headline text-sm font-bold text-on-surface">
                  Status do Sistema: Elite
                </p>
                <p className="font-label text-xs text-on-surface-variant">
                  Sincronizando com API tiger.store
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
