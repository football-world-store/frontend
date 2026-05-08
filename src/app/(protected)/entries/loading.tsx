import { Card, SkeletonTableRow } from "@/components/molecules";
import { DashboardLayout } from "@/components/templates";

const EntriesLoading = () => (
  <DashboardLayout
    title={
      <>
        Movimentações de <span className="text-primary italic">Estoque</span>
      </>
    }
    subtitle="Carregando entradas e saídas…"
  >
    <Card title="Movimentações" description="Sincronizando…">
      <SkeletonTableRow count={6} cells={5} />
    </Card>
  </DashboardLayout>
);

export default EntriesLoading;
