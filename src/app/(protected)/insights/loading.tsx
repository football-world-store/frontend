import { SkeletonCard, SkeletonStatTile } from "@/components/molecules";
import { DashboardLayout } from "@/components/templates";

const InsightsLoading = () => (
  <DashboardLayout
    title={
      <>
        INSIGHTS <span className="text-primary italic">CENTER</span>
      </>
    }
    subtitle="Sincronizando análise em tempo real…"
  >
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SkeletonStatTile />
      <SkeletonStatTile />
      <SkeletonStatTile />
    </section>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SkeletonCard bodyLines={5} />
      <SkeletonCard bodyLines={5} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SkeletonCard bodyLines={5} />
      <SkeletonCard bodyLines={5} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SkeletonCard bodyLines={4} />
      <SkeletonCard bodyLines={4} />
    </div>
  </DashboardLayout>
);

export default InsightsLoading;
