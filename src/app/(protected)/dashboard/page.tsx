"use client";

import { DashboardHome } from "@/components/templates";
import { useAuth } from "@/contexts";
import { useDashboardStatsQuery } from "@/hooks/queries";

const DashboardPage = () => {
  const { user } = useAuth();
  const { data, isLoading } = useDashboardStatsQuery();
  const greeting = user ? `Olá, ${user.name.split(" ")[0]}.` : "Olá.";

  return (
    <DashboardHome greeting={greeting} stats={data} isLoading={isLoading} />
  );
};

export default DashboardPage;
