"use client";

import { Badge, ClawIndicator, Icon, Spinner } from "@/components/atoms";
import { Card, EmptyState } from "@/components/molecules";
import { useAlertsQuery } from "@/hooks/queries";

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
  const { data, isLoading } = useAlertsQuery();

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

  if (!data || data.length === 0) {
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
      {data.map((alert) => (
        <li
          key={alert.id}
          className="flex items-start gap-3 bg-surface-container-low rounded-xl px-4 py-3 border-l-4 border-primary"
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
          <div className="flex items-center gap-3">
            <ClawIndicator level={alert.severity === "CRITICAL" ? 1 : 2} />
            <Badge tone={SEVERITY_TONE[alert.severity]}>
              {TYPE_LABEL[alert.type]}
            </Badge>
          </div>
        </li>
      ))}
    </ul>
  );

  return wrap(list, { description: `${data.length} pendentes` });
};
