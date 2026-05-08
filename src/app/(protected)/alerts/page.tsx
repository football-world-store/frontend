"use client";

import { AlertsPanel } from "@/components/organisms";
import { DashboardLayout } from "@/components/templates";
import { useAlertsCountQuery } from "@/hooks/queries";

const AlertsPage = () => {
  const { data: count } = useAlertsCountQuery();
  const total = count?.total ?? 0;
  const subtitle =
    total === 0
      ? "Nenhum alerta pendente."
      : `${count?.critical ?? 0} críticos · ${count?.informational ?? 0} informativos`;

  return (
    <DashboardLayout
      title={
        <>
          <span className="font-label text-xs uppercase tracking-widest text-primary block">
            Operações
          </span>
          ALERTAS
        </>
      }
      subtitle={subtitle}
    >
      <AlertsPanel />
    </DashboardLayout>
  );
};

export default AlertsPage;
