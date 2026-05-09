import { Card, SkeletonCard, SkeletonTableRow } from "@/components/molecules";
import { DashboardLayout } from "@/components/templates";

const InventoryLoading = () => (
  <DashboardLayout
    title={
      <>
        Gestão de <span className="text-primary italic">Estoque</span>
      </>
    }
    subtitle="Carregando catálogo…"
  >
    <div className="space-y-6">
      <Card
        tier="container-high"
        title="Gestão de Estoque"
        description="Catálogo, filtros e disponibilidade em tempo real."
      >
        <SkeletonTableRow count={6} cells={6} />
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SkeletonCard tier="container-highest" bodyLines={1} />
        <SkeletonCard tier="container-highest" bodyLines={1} />
        <SkeletonCard tier="container-highest" bodyLines={1} />
      </div>
    </div>
  </DashboardLayout>
);

export default InventoryLoading;
