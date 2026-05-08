"use client";

import { useMemo } from "react";

import { Badge, Spinner } from "@/components/atoms";
import {
  Card,
  ClubProgressList,
  EmptyState,
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
  useDashboardIdleProductsQuery,
  useDashboardMarginsQuery,
  useDashboardPaymentMethodsQuery,
  useDashboardReorderListQuery,
  useDashboardStockVelocityQuery,
  useDashboardTopClubsQuery,
} from "@/hooks/queries";
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

  const isLoading =
    marginsQuery.isLoading ||
    paymentMethodsQuery.isLoading ||
    stockVelocityQuery.isLoading;

  const clubItems = useMemo(() => {
    const top = topClubsQuery.data ?? [];
    const maxSold = top.reduce((acc, c) => Math.max(acc, c.totalSold), 0);
    return top.slice(0, 5).map((c) => ({
      name: c.clubOrBrand,
      units: c.totalSold,
      percentage: maxSold > 0 ? Math.round((c.totalSold / maxSold) * 100) : 0,
    }));
  }, [topClubsQuery.data]);

  if (isLoading) {
    return (
      <DashboardLayout title="Centro de Insights" subtitle="Carregando...">
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const margins = marginsQuery.data;
  const paymentMethods = paymentMethodsQuery.data ?? [];
  const stockVelocity = stockVelocityQuery.data ?? [];
  const idleProducts = idleProductsQuery.data ?? [];
  const reorderList = reorderListQuery.data ?? [];
  const capitalByClub = capitalByClubQuery.data ?? [];

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
          label="Lucro bruto"
          value={
            margins ? formatPriceFromReais(margins.overall.grossProfit) : "—"
          }
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
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Velocidade de estoque"
          description="Risco de ruptura nos próximos dias"
        >
          {stockVelocity.length === 0 ? (
            <EmptyState
              iconName="speed"
              title="Sem dados"
              description="Sem vendas suficientes para calcular velocidade."
            />
          ) : (
            <ul className="space-y-2">
              {stockVelocity.slice(0, 8).map((item, index) => (
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

        <Card
          title="Lista de reposição"
          description="Produtos abaixo do mínimo"
        >
          {reorderList.length === 0 ? (
            <EmptyState
              iconName="check_circle"
              title="Tudo em dia"
              description="Nenhum produto precisa de reposição agora."
            />
          ) : (
            <ul className="space-y-2">
              {reorderList.slice(0, 8).map((item, index) => (
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

        <Card
          title="Itens parados"
          description={`Sem venda há ${DEFAULT_IDLE_DAYS}+ dias`}
        >
          {idleProducts.length === 0 ? (
            <EmptyState
              iconName="hourglass_disabled"
              title="Sem itens parados"
              description="Todo o estoque está girando."
            />
          ) : (
            <ul className="space-y-2">
              {idleProducts.slice(0, 8).map((item, index) => (
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Formas de pagamento" description="Breakdown do período">
          {paymentMethods.length === 0 ? (
            <EmptyState
              iconName="payments"
              title="Sem dados"
              description="Vendas aparecerão aqui."
            />
          ) : (
            <ul className="space-y-3">
              {paymentMethods.map((method) => (
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

        <Card
          title="Capital por clube"
          description="Estoque imobilizado por clube/marca"
        >
          {capitalByClub.length === 0 ? (
            <EmptyState
              iconName="account_balance_wallet"
              title="Sem dados"
              description="Capital aparecerá aqui."
            />
          ) : (
            <ul className="space-y-3">
              {capitalByClub.slice(0, 8).map((item) => (
                <li
                  key={item.clubOrBrand}
                  className="flex items-center justify-between bg-surface-container-low rounded-xl px-4 py-3"
                >
                  <div>
                    <p className="font-body text-sm font-semibold text-on-surface">
                      {item.clubOrBrand}
                    </p>
                    <p className="font-label text-xs text-on-surface-variant">
                      {item.totalStock} unidades · {item.productVariants}{" "}
                      variantes
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
      </div>
    </DashboardLayout>
  );
};

export default InsightsPage;
