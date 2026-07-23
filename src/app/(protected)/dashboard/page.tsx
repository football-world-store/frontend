"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Button, ClawIndicator, Icon, Modal } from "@/components/atoms";
import {
  Card,
  ClubProgressList,
  EmptyState,
  PeriodFilter,
  SizesDonutChart,
  SkeletonCard,
  SkeletonStatTile,
  StatTile,
} from "@/components/molecules";
import {
  AlertsPanel,
  InsightsPanel,
  SaleForm,
  SalesTable,
  StockEntriesTable,
} from "@/components/organisms";
import { DashboardLayout } from "@/components/templates";
import { APP_ROUTES, DEFAULT_DASHBOARD_TOP_LIMIT } from "@/constants";
import { useAuth } from "@/contexts";
import {
  useAlertsCountQuery,
  useDashboardSizesQuery,
  useDashboardSummaryQuery,
  useDashboardTopClubsQuery,
} from "@/hooks/queries";
import type { DashboardPeriod, DashboardPeriodKind } from "@/types";
import { formatPriceFromReais } from "@/utils";

const DashboardSkeleton = ({ subtitle }: { subtitle: string }) => (
  <DashboardLayout
    title={
      <>
        <span className="font-label text-xs uppercase tracking-widest text-primary block">
          Visão operacional
        </span>
        DASHBOARD
      </>
    }
    subtitle={subtitle}
  >
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonStatTile key={i} />
      ))}
    </section>
    <SkeletonCard bodyLines={5} />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <SkeletonCard tier="container-high" bodyLines={4} />
        <SkeletonCard bodyLines={5} />
      </div>
      <div className="space-y-6">
        <SkeletonCard bodyLines={4} />
        <SkeletonCard bodyLines={3} />
        <SkeletonCard
          tier="container-highest"
          withHeader={false}
          bodyLines={2}
        />
      </div>
    </div>
  </DashboardLayout>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState<DashboardPeriodKind>("LAST_30_DAYS");
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

  const periodParam: DashboardPeriod = { period };
  const topListParams = { ...periodParam, limit: DEFAULT_DASHBOARD_TOP_LIMIT };

  const summaryQuery = useDashboardSummaryQuery(periodParam);
  const topClubsQuery = useDashboardTopClubsQuery(topListParams);
  const sizesQuery = useDashboardSizesQuery(periodParam);
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
    return <DashboardSkeleton subtitle={`${greeting} Sincronizando dados…`} />;
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <PeriodFilter value={period} onChange={setPeriod} />
          <Button
            className="w-full sm:w-auto"
            onClick={() => setIsSaleModalOpen(true)}
          >
            <Icon name="add_shopping_cart" size="sm" />
            Registrar nova venda
          </Button>
        </div>
      }
    >
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatTile
          label="Receita do período"
          value={formatPriceFromReais(sales.totalAmount)}
          iconName="payments"
          hero
        />
        <StatTile
          label="Lucro bruto"
          value={formatPriceFromReais(sales.grossProfit)}
          iconName="trending_up"
        />
        <StatTile
          label="Vendas no período"
          value={sales.count.toLocaleString("pt-BR")}
          iconName="shopping_cart"
        />
        <StatTile
          label="Ticket médio"
          value={formatPriceFromReais(sales.averageTicket)}
          iconName="receipt_long"
        />
      </section>

      <InsightsPanel period={periodParam} />

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
            title="Vendas recentes"
            description="Últimas vendas registradas"
            action={
              <Link
                href={APP_ROUTES.app.sales}
                className="font-label text-xs uppercase tracking-wider text-primary hover:underline focus-visible:outline-none focus-visible:ring-focus-gold rounded-lg"
              >
                Ver tudo
              </Link>
            }
          >
            <SalesTable inline />
          </Card>
          <Card
            title="Movimentações recentes"
            description="Últimas entradas e saídas"
            action={
              <Link
                href={APP_ROUTES.app.entries}
                className="font-label text-xs uppercase tracking-wider text-primary hover:underline focus-visible:outline-none focus-visible:ring-focus-gold rounded-lg"
              >
                Ver tudo
              </Link>
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

      <Modal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        title="Registrar venda"
        description="Selecione os produtos, canal e forma de pagamento."
        size="xl"
      >
        <SaleForm
          onSuccess={() => setIsSaleModalOpen(false)}
          onCancel={() => setIsSaleModalOpen(false)}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default DashboardPage;
