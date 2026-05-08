"use client";

import { Skeleton } from "@/components/atoms";
import { StatTile } from "@/components/molecules";
import { DEFAULT_DASHBOARD_PERIOD } from "@/constants";
import { useDashboardSummaryQuery } from "@/hooks/queries";
import { formatPriceFromReais } from "@/utils";

const KPI_SKELETON_COUNT = 4;

export const DashboardKPIs = () => {
  const { data, isLoading, isError } = useDashboardSummaryQuery(
    DEFAULT_DASHBOARD_PERIOD,
  );

  if (isLoading) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: KPI_SKELETON_COUNT }).map((_, i) => (
          <Skeleton key={i} className="h-[148px]" />
        ))}
      </section>
    );
  }

  if (isError || !data) {
    return null;
  }

  const tiles = [
    {
      label: "Receita total",
      value: formatPriceFromReais(data.sales.totalAmount),
      iconName: "payments",
      hero: true,
    },
    {
      label: "Total de vendas",
      value: data.sales.count.toString(),
      iconName: "shopping_cart",
      hero: false,
    },
    {
      label: "Ticket médio",
      value: formatPriceFromReais(data.sales.averageTicket),
      iconName: "receipt_long",
      hero: false,
    },
    {
      label: "Em estoque",
      value: data.stock.totalItems.toLocaleString("pt-BR"),
      iconName: "inventory_2",
      hero: false,
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {tiles.map((tile) => (
        <StatTile
          key={tile.label}
          label={tile.label}
          value={tile.value}
          iconName={tile.iconName}
          hero={tile.hero}
        />
      ))}
    </section>
  );
};
