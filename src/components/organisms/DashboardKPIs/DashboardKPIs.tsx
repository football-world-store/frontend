"use client";

import { Spinner } from "@/components/atoms";
import { StatTile } from "@/components/molecules";
import { DEFAULT_DASHBOARD_PERIOD } from "@/constants";
import { useDashboardSummaryQuery } from "@/hooks/queries";
import { formatPriceFromReais } from "@/utils";

export const DashboardKPIs = () => {
  const { data, isLoading, isError } = useDashboardSummaryQuery(
    DEFAULT_DASHBOARD_PERIOD,
  );

  if (isLoading) {
    return (
      <div className="rounded-xl bg-surface-container p-12 flex justify-center">
        <Spinner size="lg" />
      </div>
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
    },
    {
      label: "Total de vendas",
      value: data.sales.count.toString(),
      iconName: "shopping_cart",
    },
    {
      label: "Ticket médio",
      value: formatPriceFromReais(data.sales.averageTicket),
      iconName: "receipt_long",
    },
    {
      label: "Em estoque",
      value: data.stock.totalItems.toLocaleString("pt-BR"),
      iconName: "inventory_2",
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
        />
      ))}
    </section>
  );
};
