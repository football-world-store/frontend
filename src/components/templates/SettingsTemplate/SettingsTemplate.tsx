"use client";

import { useState } from "react";

import {
  Avatar,
  Badge,
  Button,
  Icon,
  IconButton,
  Input,
  Modal,
  Select,
  Spinner,
} from "@/components/atoms";
import { Card, EmptyState } from "@/components/molecules";
import { UserForm } from "@/components/organisms";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import type { AuthUser, SystemUser } from "@/types";
import { formatDateBR } from "@/utils";

const ROLE_LABEL = {
  OWNER: "Dono",
  EMPLOYEE: "Funcionário",
} as const;

interface SettingsTemplateProps {
  user: AuthUser | null;
  users: SystemUser[] | undefined;
  isLoadingUsers: boolean;
}

export const SettingsTemplate = ({
  user,
  users,
  isLoadingUsers,
}: SettingsTemplateProps) => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "system">("dark");
  const [language, setLanguage] = useState("pt-BR");
  const [stockThreshold, setStockThreshold] = useState(15);

  return (
    <DashboardLayout
      title={
        <>
          <span className="font-label text-xs uppercase tracking-widest text-primary block">
            Painel de controle
          </span>
          CONFIGURAÇÕES
        </>
      }
      subtitle="Gerencie usuários, preferências e operações do sistema."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card tier="container-high" title="Perfil do gestor">
          <div className="flex flex-col items-center gap-4 text-center">
            {user ? (
              <Avatar name={user.name} className="h-20 w-20 text-2xl" />
            ) : null}
            <div>
              <p className="font-headline text-lg font-bold text-on-surface">
                {user?.name ?? "—"}
              </p>
              <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
                {user?.email}
              </p>
              <Badge tone="primary" className="mt-2">
                Acesso principal
              </Badge>
            </div>
            <Button variant="secondary" className="w-full">
              <Icon name="lock_reset" size="sm" filled={false} />
              Trocar senha
            </Button>
            <p className="font-label text-xs text-on-surface-variant">
              Último login: 2h atrás · IP 192.168.1.45
            </p>
          </div>
        </Card>

        <Card tier="container-high" title="Preferências do sistema">
          <ul className="space-y-4">
            <li className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm text-on-surface">Tema visual</p>
                <p className="font-label text-xs text-on-surface-variant">
                  Apenas escuro ou seguir sistema (preview)
                </p>
              </div>
              <Select
                options={[
                  { value: "dark", label: "Apenas escuro" },
                  { value: "system", label: "Sistema" },
                ]}
                value={theme}
                onChange={(e) => setTheme(e.target.value as "dark" | "system")}
                className="w-32"
              />
            </li>
            <li className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm text-on-surface">
                  Idioma da interface
                </p>
                <p className="font-label text-xs text-on-surface-variant">
                  Idioma da interface
                </p>
              </div>
              <Select
                options={[
                  { value: "pt-BR", label: "Português" },
                  { value: "en", label: "English" },
                ]}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-32"
              />
            </li>
            <li className="flex items-center justify-between gap-4">
              <div>
                <p className="font-body text-sm text-on-surface">
                  Limite de alerta de estoque
                </p>
                <p className="font-label text-xs text-on-surface-variant">
                  Quantidade mínima antes do alerta
                </p>
              </div>
              <Input
                type="number"
                value={stockThreshold}
                onChange={(e) => setStockThreshold(Number(e.target.value))}
                className="w-24 h-10 text-center"
              />
            </li>
          </ul>
        </Card>

        <Card tier="container-high" title="Operações de dados">
          <div className="space-y-3">
            <Button
              type="button"
              variant="secondary"
              className="w-full justify-start gap-3"
            >
              <Icon name="picture_as_pdf" size="sm" />
              Exportar relatório mensal (PDF)
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full justify-start gap-3"
            >
              <Icon name="cloud_download" size="sm" />
              Backup do banco de dados
            </Button>
            <p className="font-label text-xs text-on-surface-variant pt-2">
              Último backup: hoje, 06:30
            </p>
            <h4 className="font-label uppercase tracking-wider text-xs text-on-surface-variant pt-3">
              Ações críticas
            </h4>
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start gap-3"
            >
              <Icon name="cleaning_services" size="sm" />
              Limpar cache de transações
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start gap-3"
            >
              <Icon name="restart_alt" size="sm" />
              Resetar métricas de performance
            </Button>
          </div>
        </Card>
      </div>

      <Card
        tier="container-high"
        title="Gestão de acesso"
        description="Usuários do sistema e seus perfis"
        action={
          <Button type="button" onClick={() => setIsUserModalOpen(true)}>
            <Icon name="person_add" size="sm" />
            Novo usuário
          </Button>
        }
      >
        {(() => {
          if (isLoadingUsers) {
            return (
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            );
          }
          if (!users || users.length === 0) {
            return (
              <EmptyState
                iconName="manage_accounts"
                title="Sem usuários"
                description="Cadastre o primeiro usuário do sistema."
              />
            );
          }
          return (
            <ul className="space-y-2">
              {users.map((systemUser, index) => (
                <li
                  key={systemUser.id}
                  className={`flex items-center gap-4 rounded-xl px-4 py-3 ${
                    index % 2 === 0
                      ? "bg-surface-container-low"
                      : "bg-surface-container"
                  }`}
                >
                  <Avatar name={systemUser.name} />
                  <div className="flex-1">
                    <p className="font-body text-sm font-semibold text-on-surface">
                      {systemUser.name}
                    </p>
                    <p className="font-label text-xs text-on-surface-variant">
                      {systemUser.email}
                    </p>
                  </div>
                  <Badge
                    tone={systemUser.role === "OWNER" ? "primary" : "neutral"}
                  >
                    {ROLE_LABEL[systemUser.role]}
                  </Badge>
                  <span className="font-label text-xs text-on-surface-variant">
                    {systemUser.lastLoginAt
                      ? `Último: ${formatDateBR(systemUser.lastLoginAt)}`
                      : "Sem acesso"}
                  </span>
                  <IconButton iconName="edit" label="Editar" filled={false} />
                </li>
              ))}
            </ul>
          );
        })()}
      </Card>

      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title="Novo usuário"
        description="Cadastre um novo membro da equipe. Ele receberá um email para definir senha."
        size="lg"
      >
        <UserForm
          onSuccess={() => setIsUserModalOpen(false)}
          onCancel={() => setIsUserModalOpen(false)}
        />
      </Modal>
    </DashboardLayout>
  );
};
