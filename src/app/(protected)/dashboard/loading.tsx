import { SkeletonCard, SkeletonStatTile } from "@/components/molecules";
import { DashboardLayout } from "@/components/templates";

const DashboardLoading = () => (
  <DashboardLayout
    title={
      <>
        <span className="font-label text-xs uppercase tracking-widest text-primary block">
          Visão operacional
        </span>
        DASHBOARD
      </>
    }
    subtitle="Sincronizando dados…"
  >
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonStatTile key={i} />
      ))}
    </section>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <SkeletonCard tier="container-high" bodyLines={4} />
        <SkeletonCard bodyLines={5} />
      </div>
      <div className="space-y-6">
        <SkeletonCard bodyLines={4} />
        <SkeletonCard bodyLines={3} />
        <SkeletonCard
          tier="container-highest"
          withHeader={false}
          bodyLines={2}
        />
      </div>
    </div>
  </DashboardLayout>
);

export default DashboardLoading;
