"use client";

import { Spinner } from "@/components/atoms";
import { StatTile } from "@/components/molecules";
import { useDashboardStatsQuery } from "@/hooks/queries";

export const DashboardKPIs = () => {
  const { data, isLoading, isError } = useDashboardStatsQuery();

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
    { stat: data.totalRevenue, icon: "payments" },
    { stat: data.totalSales, icon: "shopping_cart" },
    { stat: data.averageTicket, icon: "receipt_long" },
    { stat: data.productsInStock, icon: "inventory_2" },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {tiles.map(({ stat, icon }) => (
        <StatTile
          key={stat.label}
          label={stat.label}
          value={stat.formatted}
          delta={stat.delta}
          trend={stat.trend}
          iconName={icon}
        />
      ))}
    </section>
  );
};
