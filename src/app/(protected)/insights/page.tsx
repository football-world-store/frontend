"use client";

import { useMemo } from "react";

import { Badge } from "@/components/atoms";
import {
  Card,
  ClubProgressList,
  ClubTrendChart,
  EmptyState,
  SkeletonCard,
  SkeletonStatTile,
  StatTile,
} from "@/components/molecules";
import { DashboardLayout } from "@/components/templates";
import {
  DEFAULT_DASHBOARD_PERIOD,
  DEFAULT_DASHBOARD_TOP_LIMIT,
  DEFAULT_IDLE_DAYS,
} from "@/constants";
import {
  useDashboardCapitalByClubQuery,
  useDashboardClubTrendQuery,
  useDashboardCustomersByTeamQuery,
  useDashboardIdleProductsQuery,
  useDashboardMarginsQuery,
  useDashboardPaymentMethodsQuery,
  useDashboardReorderListQuery,
  useDashboardReservationConversionQuery,
  useDashboardStockVelocityQuery,
  useDashboardTopClubsQuery,
} from "@/hooks/queries";
import type {
  DashboardCapitalByClub,
  DashboardClubTrendEntry,
  DashboardCustomersByTeam,
  DashboardIdleProduct,
  DashboardMargins,
  DashboardPaymentMethod,
  DashboardReorderItem,
  DashboardReservationConversion,
  DashboardStockVelocityItem,
} from "@/types";
import { formatPriceFromReais, zebraRowTier } from "@/utils";

const TOP_LIST_PARAMS = {
  ...DEFAULT_DASHBOARD_PERIOD,
  limit: DEFAULT_DASHBOARD_TOP_LIMIT,
};

const RISK_TONE = {
  CRITICAL: "error",
  WARNING: "warning",
  OK: "success",
} as const;

const InsightsSkeleton = () => (
  <DashboardLayout
    title={
      <>
        INSIGHTS <span className="text-primary italic">CENTER</span>
      </>
    }
    subtitle="Sincronizando análise em tempo real…"
  >
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <SkeletonStatTile />
      <SkeletonStatTile />
      <SkeletonStatTile />
      <SkeletonStatTile />
    </section>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SkeletonCard bodyLines={5} />
      <SkeletonCard bodyLines={5} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SkeletonCard bodyLines={5} />
      <SkeletonCard bodyLines={5} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SkeletonCard bodyLines={4} />
      <SkeletonCard bodyLines={4} />
    </div>
  </DashboardLayout>
);

const StockVelocityCard = ({
  items,
}: {
  items: DashboardStockVelocityItem[];
}) => (
  <Card
    title="Velocidade de estoque"
    description="Risco de ruptura nos próximos dias"
  >
    {items.length === 0 ? (
      <EmptyState
        iconName="speed"
        title="Sem dados"
        description="Sem vendas suficientes para calcular velocidade."
      />
    ) : (
      <ul className="space-y-2">
        {items.slice(0, 8).map((item, index) => (
          <li
            key={item.id}
            className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 ${zebraRowTier(index)}`}
          >
            <div>
              <p className="font-body text-sm font-semibold text-on-surface">
                {item.name}
              </p>
              <p className="font-label text-xs text-on-surface-variant">
                {item.currentStock} em estoque ·{" "}
                {item.daysUntilStockout === null
                  ? "sem giro"
                  : `${item.daysUntilStockout} dias até zerar`}
              </p>
            </div>
            <Badge tone={RISK_TONE[item.risk]}>{item.risk}</Badge>
          </li>
        ))}
      </ul>
    )}
  </Card>
);

const ReorderListCard = ({ items }: { items: DashboardReorderItem[] }) => (
  <Card title="Lista de reposição" description="Produtos abaixo do mínimo">
    {items.length === 0 ? (
      <EmptyState
        iconName="check_circle"
        title="Tudo em dia"
        description="Nenhum produto precisa de reposição agora."
      />
    ) : (
      <ul className="space-y-2">
        {items.slice(0, 8).map((item, index) => (
          <li
            key={item.id}
            className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 ${zebraRowTier(index)}`}
          >
            <div>
              <p className="font-body text-sm font-semibold text-on-surface">
                {item.name}
              </p>
              <p className="font-label text-xs text-on-surface-variant">
                Déficit {item.deficit} ·{" "}
                {formatPriceFromReais(item.reorderCost)} para repor
              </p>
            </div>
            <Badge tone="warning">
              {item.currentStock}/{item.minStock}
            </Badge>
          </li>
        ))}
      </ul>
    )}
  </Card>
);

const IdleProductsCard = ({ items }: { items: DashboardIdleProduct[] }) => (
  <Card
    title="Itens parados"
    description={`Sem venda há ${DEFAULT_IDLE_DAYS}+ dias`}
  >
    {items.length === 0 ? (
      <EmptyState
        iconName="hourglass_disabled"
        title="Sem itens parados"
        description="Todo o estoque está girando."
      />
    ) : (
      <ul className="space-y-2">
        {items.slice(0, 8).map((item, index) => (
          <li
            key={item.id}
            className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 ${zebraRowTier(index)}`}
          >
            <div>
              <p className="font-body text-sm font-semibold text-on-surface">
                {item.name}
              </p>
              <p className="font-label text-xs text-on-surface-variant">
                {item.daysIdle ?? "—"} dias · {item.quantity} em estoque ·{" "}
                {formatPriceFromReais(item.stuckValue)} parados
              </p>
            </div>
            <Badge tone="warning">Promover</Badge>
          </li>
        ))}
      </ul>
    )}
  </Card>
);

const PaymentMethodsCard = ({ items }: { items: DashboardPaymentMethod[] }) => (
  <Card title="Formas de pagamento" description="Breakdown do período">
    {items.length === 0 ? (
      <EmptyState
        iconName="payments"
        title="Sem dados"
        description="Vendas aparecerão aqui."
      />
    ) : (
      <ul className="space-y-3">
        {items.map((method) => (
          <li
            key={method.method}
            className="flex items-center justify-between bg-surface-container-low rounded-xl px-4 py-3"
          >
            <div>
              <p className="font-body text-sm font-semibold text-on-surface">
                {method.method}
              </p>
              <p className="font-label text-xs text-on-surface-variant">
                {method.saleCount} vendas · {method.percentage}%
              </p>
            </div>
            <span className="font-body font-semibold text-primary">
              {formatPriceFromReais(method.totalAmount)}
            </span>
          </li>
        ))}
      </ul>
    )}
  </Card>
);

const CapitalByClubCard = ({ items }: { items: DashboardCapitalByClub[] }) => (
  <Card
    title="Capital por clube"
    description="Estoque imobilizado por clube/marca"
  >
    {items.length === 0 ? (
      <EmptyState
        iconName="account_balance_wallet"
        title="Sem dados"
        description="Capital aparecerá aqui."
      />
    ) : (
      <ul className="space-y-3">
        {items.slice(0, 8).map((item) => (
          <li
            key={item.clubOrBrand}
            className="flex items-center justify-between bg-surface-container-low rounded-xl px-4 py-3"
          >
            <div>
              <p className="font-body text-sm font-semibold text-on-surface">
                {item.clubOrBrand}
              </p>
              <p className="font-label text-xs text-on-surface-variant">
                {item.totalStock} unidades · {item.productVariants} variantes
              </p>
            </div>
            <div className="text-right">
              <p className="font-body font-semibold text-on-surface">
                {formatPriceFromReais(item.totalCapital)}
              </p>
              <p className="font-label text-xs text-primary">
                {item.capitalPercentage}%
              </p>
            </div>
          </li>
        ))}
      </ul>
    )}
  </Card>
);

const ClubTrendCard = ({ entries }: { entries: DashboardClubTrendEntry[] }) => (
  <Card
    title="Sazonalidade por clube"
    description="Unidades vendidas mês a mês — picos ajudam a planejar reposição"
  >
    {entries.length === 0 ? (
      <EmptyState
        iconName="show_chart"
        title="Sem dados"
        description="A série mensal aparecerá aqui conforme houver vendas."
      />
    ) : (
      <ClubTrendChart entries={entries} />
    )}
  </Card>
);

const CustomersByTeamCard = ({
  items,
}: {
  items: DashboardCustomersByTeam[];
}) => (
  <Card
    title="Times do coração"
    description="Valor de cliente por time — mira para campanhas segmentadas"
  >
    {items.length === 0 ? (
      <EmptyState
        iconName="groups"
        title="Sem dados"
        description="Cadastre clientes com time do coração para ver o ranking."
      />
    ) : (
      <ul className="space-y-3">
        {items.slice(0, 8).map((item) => (
          <li
            key={item.favoriteTeam}
            className="flex items-center justify-between bg-surface-container-low rounded-xl px-4 py-3"
          >
            <div>
              <p className="font-body text-sm font-semibold text-on-surface">
                {item.favoriteTeam}
              </p>
              <p className="font-label text-xs text-on-surface-variant">
                {item.customerCount} clientes · {item.totalPurchases} compras
              </p>
            </div>
            <div className="text-right">
              <p className="font-body font-semibold text-on-surface">
                {formatPriceFromReais(item.totalSpent)}
              </p>
              <p className="font-label text-xs text-primary">
                Ticket médio {formatPriceFromReais(item.averageSpent)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    )}
  </Card>
);

const SummaryStats = ({
  margins,
  reservationConversion,
}: {
  margins: DashboardMargins | undefined;
  reservationConversion: DashboardReservationConversion | undefined;
}) => (
  <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
    <StatTile
      label="Lucro bruto"
      value={margins ? formatPriceFromReais(margins.overall.grossProfit) : "—"}
      iconName="paid"
    />
    <StatTile
      label="Margem geral"
      value={margins ? `${margins.overall.marginPercentage}%` : "—"}
      iconName="percent"
    />
    <StatTile
      label="Receita do período"
      value={margins ? formatPriceFromReais(margins.overall.revenue) : "—"}
      iconName="trending_up"
    />
    <StatTile
      label="Conversão de reservas"
      value={
        reservationConversion ? `${reservationConversion.conversionRate}%` : "—"
      }
      iconName="event_available"
    />
  </section>
);

const useClubProgressItems = (
  data: { clubOrBrand: string; totalSold: number }[] | undefined,
) =>
  useMemo(() => {
    const top = data ?? [];
    const maxSold = top.reduce((acc, c) => Math.max(acc, c.totalSold), 0);
    return top.slice(0, 5).map((c) => ({
      name: c.clubOrBrand,
      units: c.totalSold,
      percentage: maxSold > 0 ? Math.round((c.totalSold / maxSold) * 100) : 0,
    }));
  }, [data]);

const InsightsPage = () => {
  const marginsQuery = useDashboardMarginsQuery(DEFAULT_DASHBOARD_PERIOD);
  const paymentMethodsQuery = useDashboardPaymentMethodsQuery(
    DEFAULT_DASHBOARD_PERIOD,
  );
  const stockVelocityQuery = useDashboardStockVelocityQuery();
  const idleProductsQuery = useDashboardIdleProductsQuery(DEFAULT_IDLE_DAYS);
  const reorderListQuery = useDashboardReorderListQuery();
  const capitalByClubQuery = useDashboardCapitalByClubQuery();
  const topClubsQuery = useDashboardTopClubsQuery(TOP_LIST_PARAMS);
  const clubTrendQuery = useDashboardClubTrendQuery();
  const customersByTeamQuery = useDashboardCustomersByTeamQuery();
  const reservationConversionQuery = useDashboardReservationConversionQuery(
    DEFAULT_DASHBOARD_PERIOD,
  );

  const isLoading =
    marginsQuery.isLoading ||
    paymentMethodsQuery.isLoading ||
    stockVelocityQuery.isLoading;

  const clubItems = useClubProgressItems(topClubsQuery.data);

  if (isLoading) {
    return <InsightsSkeleton />;
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
      <SummaryStats
        margins={marginsQuery.data}
        reservationConversion={reservationConversionQuery.data}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockVelocityCard items={stockVelocityQuery.data ?? []} />
        <ReorderListCard items={reorderListQuery.data ?? []} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Top 5 Clubes" description="Volume de unidades vendidas">
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
        <IdleProductsCard items={idleProductsQuery.data?.items ?? []} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaymentMethodsCard items={paymentMethodsQuery.data ?? []} />
        <CapitalByClubCard items={capitalByClubQuery.data ?? []} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClubTrendCard entries={clubTrendQuery.data ?? []} />
        <CustomersByTeamCard items={customersByTeamQuery.data ?? []} />
      </div>
    </DashboardLayout>
  );
};

export default InsightsPage;
