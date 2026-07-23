"use client";

import { useState } from "react";

import { Badge, ClawIndicator, Icon, IconButton } from "@/components/atoms";
import {
  Card,
  ConfirmDialog,
  EmptyState,
  SkeletonListRow,
} from "@/components/molecules";
import { useAlertsQuery } from "@/hooks/queries";
import { useResolveAlertMutation } from "@/hooks/mutations";

const SEVERITY_TONE = {
  CRITICAL: "error",
  INFORMATIONAL: "warning",
} as const;

const TYPE_LABEL = {
  STOCK_LOW: "Estoque crítico",
  STOCK_OUT: "Estoque zerado",
  PRODUCT_IDLE: "Produto parado",
} as const;

interface AlertsPanelProps {
  inline?: boolean;
}

export const AlertsPanel = ({ inline = false }: AlertsPanelProps) => {
  const { data: alerts, isLoading } = useAlertsQuery();
  const resolveMutation = useResolveAlertMutation();
  const [pendingResolveId, setPendingResolveId] = useState<string | null>(null);

  const pendingAlert =
    pendingResolveId && alerts
      ? (alerts.find((alert) => alert.id === pendingResolveId) ?? null)
      : null;

  const handleConfirmResolve = () => {
    if (!pendingResolveId) return;
    resolveMutation.mutate({ id: pendingResolveId });
    setPendingResolveId(null);
  };

  const wrap = (children: React.ReactNode, props?: { description?: string }) =>
    inline ? (
      <>{children}</>
    ) : (
      <Card title="Alertas" description={props?.description}>
        {children}
      </Card>
    );

  if (isLoading) {
    return wrap(<SkeletonListRow count={3} withAvatar />);
  }

  if (!alerts || alerts.length === 0) {
    return wrap(
      <EmptyState
        iconName="notifications_active"
        title="Tudo certo"
        description="Nenhum alerta no momento."
      />,
    );
  }

  const list = (
    <ul className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
      {alerts.map((alert) => {
        const isResolving =
          resolveMutation.isPending &&
          resolveMutation.variables?.id === alert.id;
        return (
          <li
            key={alert.id}
            className={`flex items-start gap-3 rounded-xl px-4 py-4 ${
              alert.severity === "CRITICAL"
                ? "bg-error-container/40"
                : "bg-surface-container-low"
            }`}
          >
            <span
              className={`inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                alert.severity === "CRITICAL"
                  ? "bg-error text-on-error"
                  : "bg-primary-container text-on-primary-container"
              }`}
              aria-hidden
            >
              <Icon
                name={alert.severity === "CRITICAL" ? "warning" : "info"}
                size="md"
              />
            </span>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 space-y-1">
                  <p className="font-body text-sm font-semibold text-on-surface">
                    {alert.productName ?? alert.message}
                  </p>
                  <p className="font-label text-xs text-on-surface-variant">
                    {alert.message}
                  </p>
                </div>
                <IconButton
                  iconName="check"
                  label="Marcar como resolvido"
                  isLoading={isResolving}
                  onClick={() => setPendingResolveId(alert.id)}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <ClawIndicator level={alert.severity === "CRITICAL" ? 1 : 2} />
                <Badge tone={SEVERITY_TONE[alert.severity]}>
                  {TYPE_LABEL[alert.type]}
                </Badge>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {wrap(list, { description: `${alerts.length} pendentes` })}
      <ConfirmDialog
        isOpen={pendingResolveId !== null}
        onClose={() => setPendingResolveId(null)}
        onConfirm={handleConfirmResolve}
        title="Marcar alerta como resolvido?"
        description={
          pendingAlert
            ? `O alerta "${pendingAlert.productName ?? pendingAlert.message}" sairá da lista de pendentes.`
            : undefined
        }
        confirmLabel="Resolver"
        isPending={resolveMutation.isPending}
      />
    </>
  );
};
