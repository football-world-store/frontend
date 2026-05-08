"use client";

import {
  Badge,
  ClawIndicator,
  Icon,
  IconButton,
  Spinner,
} from "@/components/atoms";
import { Card, EmptyState } from "@/components/molecules";
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

  const wrap = (children: React.ReactNode, props?: { description?: string }) =>
    inline ? (
      <>{children}</>
    ) : (
      <Card title="Alertas" description={props?.description}>
        {children}
      </Card>
    );

  if (isLoading) {
    return wrap(
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>,
    );
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
    <ul className="space-y-3">
      {alerts.map((alert) => {
        const isResolving =
          resolveMutation.isPending &&
          resolveMutation.variables?.id === alert.id;
        return (
          <li
            key={alert.id}
            className={`flex items-start gap-3 rounded-xl px-4 py-3 ${
              alert.severity === "CRITICAL"
                ? "bg-error-container/40"
                : "bg-surface-container-low"
            }`}
          >
            <Icon
              name={alert.severity === "CRITICAL" ? "warning" : "info"}
              className={
                alert.severity === "CRITICAL" ? "text-error" : "text-primary"
              }
              size="md"
            />
            <div className="flex-1 space-y-1">
              <p className="font-body text-sm font-semibold text-on-surface">
                {alert.productName ?? alert.message}
              </p>
              <p className="font-label text-xs text-on-surface-variant">
                {alert.message}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <ClawIndicator level={alert.severity === "CRITICAL" ? 1 : 2} />
              <Badge tone={SEVERITY_TONE[alert.severity]}>
                {TYPE_LABEL[alert.type]}
              </Badge>
              <IconButton
                iconName={isResolving ? "hourglass_empty" : "check"}
                label="Marcar como resolvido"
                disabled={isResolving}
                onClick={() => resolveMutation.mutate({ id: alert.id })}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );

  return wrap(list, { description: `${alerts.length} pendentes` });
};
