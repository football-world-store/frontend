import { Card, SkeletonListRow } from "@/components/molecules";
import { DashboardLayout } from "@/components/templates";

const AlertsLoading = () => (
  <DashboardLayout
    title={
      <>
        Central de <span className="text-primary italic">Alertas</span>
      </>
    }
    subtitle="Carregando alertas…"
  >
    <Card
      tier="container-high"
      title="Alertas pendentes"
      description="Sincronizando…"
    >
      <SkeletonListRow count={5} withAvatar />
    </Card>
  </DashboardLayout>
);

export default AlertsLoading;
