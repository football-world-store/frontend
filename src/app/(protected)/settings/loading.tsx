import { Card, SkeletonCard, SkeletonListRow } from "@/components/molecules";
import { DashboardLayout } from "@/components/templates";

const SettingsLoading = () => (
  <DashboardLayout
    title={
      <>
        <span className="font-label text-xs uppercase tracking-widest text-primary block">
          Painel de Controle
        </span>
        CONFIGURAÇÕES DO SISTEMA
      </>
    }
    subtitle="Carregando configurações…"
  >
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <SkeletonCard tier="container-high" bodyLines={4} />
      <SkeletonCard tier="container-high" bodyLines={4} />
      <SkeletonCard tier="container-high" bodyLines={4} />
    </div>
    <Card
      tier="container-high"
      title="Gestão de acesso"
      description="Usuários do sistema e seus perfis"
    >
      <SkeletonListRow count={4} withAvatar />
    </Card>
  </DashboardLayout>
);

export default SettingsLoading;
