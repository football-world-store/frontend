import { Card, SkeletonListRow } from "@/components/molecules";
import { DashboardLayout } from "@/components/templates";

const CustomersLoading = () => (
  <DashboardLayout
    title={
      <>
        Gestão de <span className="text-primary italic">Elite</span>
      </>
    }
    subtitle="Carregando base de clientes…"
  >
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-6">
        <Card
          tier="container-highest"
          title="Ranking de Elite"
          description="Top 3 do faturamento"
        >
          <SkeletonListRow count={3} withAvatar />
        </Card>
        <Card title="Ticket médio mensal">
          <SkeletonListRow count={1} withTrailingValue={false} />
        </Card>
      </div>
      <Card
        className="lg:col-span-2"
        tier="container-high"
        title="Gestão de Elite"
        description="Controle de performance e ranking de clientes."
      >
        <SkeletonListRow count={6} withAvatar />
      </Card>
    </div>
  </DashboardLayout>
);

export default CustomersLoading;
