"use client";

import { Badge } from "@/components/atoms";
import { Card, EmptyState, SkeletonTableRow } from "@/components/molecules";
import { DashboardLayout } from "@/components/templates";
import { useAuditLogsQuery } from "@/hooks/queries";
import type { AuditAction } from "@/types";
import { formatDateBR } from "@/utils";

const ACTION_LABEL: Record<AuditAction, string> = {
  CREATE: "Criou",
  UPDATE: "Atualizou",
  DELETE: "Excluiu",
  SALE: "Registrou venda",
  ENTRY: "Entrada de estoque",
  CANCEL: "Cancelou",
  LOGIN: "Login",
  LOGOUT: "Logout",
};

const ACTION_TONE: Record<
  AuditAction,
  "neutral" | "success" | "warning" | "error" | "primary"
> = {
  CREATE: "success",
  UPDATE: "primary",
  DELETE: "error",
  SALE: "success",
  ENTRY: "primary",
  CANCEL: "warning",
  LOGIN: "neutral",
  LOGOUT: "neutral",
};

const AuditPage = () => {
  const { data, isLoading } = useAuditLogsQuery();
  const logs = data?.items ?? [];

  return (
    <DashboardLayout
      title={
        <>
          <span className="font-label text-xs uppercase tracking-widest text-primary block">
            Segurança
          </span>
          AUDITORIA
        </>
      }
      subtitle="Histórico completo de ações sensíveis no sistema."
    >
      <Card
        title="Eventos recentes"
        description={logs.length > 0 ? `${logs.length} registros` : undefined}
      >
        {isLoading ? (
          <SkeletonTableRow count={6} cells={5} />
        ) : logs.length === 0 ? (
          <EmptyState
            iconName="history"
            title="Sem eventos"
            description="As ações de OWNERs e funcionários aparecerão aqui."
          />
        ) : (
          <div className="flex flex-col gap-2 rounded-xl overflow-hidden">
            {logs.map((log, index) => (
              <div
                key={log.id}
                className={`grid grid-cols-12 items-center gap-3 px-4 py-3 ${
                  index % 2 === 0
                    ? "bg-surface-container-low"
                    : "bg-surface-container"
                }`}
              >
                <div className="col-span-12 md:col-span-5 min-w-0">
                  <p className="font-body text-sm font-semibold text-on-surface truncate">
                    {log.userName}
                  </p>
                  <p className="font-label text-xs text-on-surface-variant truncate">
                    {log.entity}
                    {log.entityId ? ` · ${log.entityId.slice(0, 8)}…` : ""}
                  </p>
                </div>
                <div className="col-span-6 md:col-span-3">
                  <Badge tone={ACTION_TONE[log.action]}>
                    {ACTION_LABEL[log.action]}
                  </Badge>
                </div>
                <div className="col-span-6 md:col-span-2 font-label text-xs text-on-surface-variant truncate">
                  {log.ipAddress ?? "—"}
                </div>
                <div className="col-span-12 md:col-span-2 font-label text-xs text-on-surface-variant text-right">
                  {formatDateBR(log.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default AuditPage;
