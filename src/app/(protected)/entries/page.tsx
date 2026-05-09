"use client";

import { Avatar, Badge, ClawIndicator } from "@/components/atoms";
import { Card } from "@/components/molecules";
import { StockEntriesTable, StockMovementForm } from "@/components/organisms";
import { DashboardLayout } from "@/components/templates";
import { useAuth } from "@/contexts";
import { useProductsQuery } from "@/hooks/queries";

const EntriesPage = () => {
  const { user } = useAuth();
  const { data } = useProductsQuery();

  const stockHealth = (() => {
    const list = data?.items ?? [];
    if (list.length === 0) {
      return {
        critical: 0,
        warning: 0,
        healthy: 0,
      };
    }
    const critical = list.filter((p) => p.quantity === 0).length;
    const warning = list.filter(
      (p) => p.quantity > 0 && p.quantity <= p.minStock,
    ).length;
    const healthy = list.length - critical - warning;
    return { critical, warning, healthy };
  })();

  return (
    <DashboardLayout
      title={
        <>
          {/* Tradução: "Inventory · Movement Registration" → "Inventário · Registro de Movimentação" */}
          {/* Tradução: "MOVEMENT COMMAND" → "COMANDO DE MOVIMENTAÇÃO" */}
          <span className="font-label text-xs uppercase tracking-widest text-primary block">
            Inventário · Registro de Movimentação
          </span>
          COMANDO DE MOVIMENTAÇÃO
        </>
      }
      subtitle="Registre entradas e saídas com precisão de comando."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StockMovementForm />
        </div>
        <div className="space-y-6">
          {/* Tradução: "Current responsible" → "Responsável atual" + "Last action" → "Última ação" */}
          <Card tier="container-highest" title="Responsável atual">
            <div className="flex items-center gap-3">
              {user ? <Avatar name={user.name} className="h-12 w-12" /> : null}
              <div>
                <p className="font-body text-sm font-semibold text-on-surface">
                  {user?.name ?? "—"}
                </p>
                <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
                  Última ação: agora
                </p>
              </div>
            </div>
          </Card>
          {/* Tradução: "Stock health gauge" → "Indicador de saúde do estoque" */}
          <Card tier="container-highest" title="Indicador de saúde do estoque">
            <ul className="space-y-3">
              <li className="flex items-center justify-between">
                <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
                  Esgotados
                </span>
                <div className="flex items-center gap-3">
                  <Badge tone="error">{stockHealth.critical}</Badge>
                  <ClawIndicator level={stockHealth.critical > 0 ? 1 : 0} />
                </div>
              </li>
              <li className="flex items-center justify-between">
                <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
                  Em alerta
                </span>
                <div className="flex items-center gap-3">
                  <Badge tone="warning">{stockHealth.warning}</Badge>
                  <ClawIndicator level={stockHealth.warning > 0 ? 2 : 0} />
                </div>
              </li>
              <li className="flex items-center justify-between">
                <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
                  Saudáveis
                </span>
                <div className="flex items-center gap-3">
                  <Badge tone="success">{stockHealth.healthy}</Badge>
                  <ClawIndicator level={stockHealth.healthy > 0 ? 3 : 0} />
                </div>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      <Card title="Histórico de hoje" description="Movimentações recentes">
        <StockEntriesTable inline />
      </Card>
    </DashboardLayout>
  );
};

export default EntriesPage;
