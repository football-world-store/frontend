"use client";

import { InsightsTemplate } from "@/components/templates";
import { useDashboardStatsQuery } from "@/hooks/queries";

const InsightsPage = () => {
  const { data, isLoading } = useDashboardStatsQuery();

  return <InsightsTemplate stats={data} isLoading={isLoading} />;
};

export default InsightsPage;
