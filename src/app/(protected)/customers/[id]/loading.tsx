import { Card, SkeletonCard, SkeletonListRow } from "@/components/molecules";
import { DashboardLayout } from "@/components/templates";

const CustomerDetailLoading = () => (
  <DashboardLayout
    title={
      <>
        Ficha do <span className="text-primary italic">Campeão</span>
      </>
    }
    subtitle="Carregando ficha…"
  >
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <SkeletonCard tier="container-high" bodyLines={3} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SkeletonCard tier="container-highest" bodyLines={1} />
          <SkeletonCard tier="container-highest" bodyLines={1} />
          <SkeletonCard tier="container-highest" bodyLines={1} />
        </div>
        <SkeletonCard bodyLines={2} />
        <Card title="Últimos pedidos" description="Histórico recente">
          <SkeletonListRow count={3} />
        </Card>
      </div>
      <div className="space-y-6">
        <SkeletonCard tier="container-high" bodyLines={5} />
        <SkeletonCard bodyLines={3} />
      </div>
    </div>
  </DashboardLayout>
);

export default CustomerDetailLoading;
