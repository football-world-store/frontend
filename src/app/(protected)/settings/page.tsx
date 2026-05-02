"use client";

import { useState } from "react";

import {
  Avatar,
  Badge,
  Button,
  Icon,
  IconButton,
  Modal,
  Select,
  Spinner,
} from "@/components/atoms";
import { Card, EmptyState } from "@/components/molecules";
import { UserForm } from "@/components/organisms";
import { DashboardLayout } from "@/components/templates";
import { useAuth } from "@/contexts";
import { useUsersQuery } from "@/hooks/queries";
import { formatDateBR } from "@/utils";

const ROLE_LABEL = {
  OWNER: "Dono",
  EMPLOYEE: "Funcionário",
} as const;

const SettingsPage = () => {
  const { user } = useAuth();
  const { data, isLoading } = useUsersQuery();
  const users = data?.items ?? [];
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "system">("dark");
  const [language, setLanguage] = useState("pt-BR");
  const [stockThreshold, setStockThreshold] = useState(15);

  return (
    <DashboardLayout
      title={
        <>
          <span className="font-label text-xs uppercase tracking-widest text-primary block">
            Control Panel
          </span>
          SYSTEM SETTINGS
        </>
      }
      subtitle="Gerencie usuários, preferências e operações do sistema."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card tier="container-high" title="Manager profile">
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
                Primary access
              </Badge>
            </div>
            <Button variant="secondary" className="w-full">
              <Icon name="lock_reset" size="sm" filled={false} />
              Trocar senha
            </Button>
            <p className="font-label text-xs text-on-surface-variant">
              Last login: 2h atrás · IP 192.168.1.45
            </p>
          </div>
        </Card>

        <Card tier="container-high" title="System preferences">
          <ul className="space-y-4">
            <li className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm text-on-surface">
                  Visual theme
                </p>
                <p className="font-label text-xs text-on-surface-variant">
                  Dark only ou seguir sistema (preview)
                </p>
              </div>
              <Select
                options={[
                  { value: "dark", label: "Dark only" },
                  { value: "system", label: "System" },
                ]}
                value={theme}
                onChange={(e) => setTheme(e.target.value as "dark" | "system")}
                className="w-32"
              />
            </li>
            <li className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm text-on-surface">
                  Display language
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
                  Stock alert threshold
                </p>
                <p className="font-label text-xs text-on-surface-variant">
                  Quantidade mínima antes do alerta
                </p>
              </div>
              <input
                type="number"
                value={stockThreshold}
                onChange={(e) => setStockThreshold(Number(e.target.value))}
                className="w-24 h-10 rounded-xl bg-surface-container-lowest text-on-surface text-center font-body text-sm focus-visible:outline-none focus-visible:ring-focus-gold"
              />
            </li>
          </ul>
        </Card>

        <Card tier="container-high" title="Data ops">
          <div className="space-y-3">
            <Button variant="secondary" className="w-full justify-start gap-3">
              <Icon name="picture_as_pdf" size="sm" />
              Export monthly report (PDF)
            </Button>
            <Button variant="secondary" className="w-full justify-start gap-3">
              <Icon name="cloud_download" size="sm" />
              Backup database
            </Button>
            <p className="font-label text-xs text-on-surface-variant pt-2">
              Last backup: hoje, 06:30
            </p>
            <h4 className="font-label uppercase tracking-wider text-xs text-on-surface-variant pt-3">
              Critical actions
            </h4>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Icon name="cleaning_services" size="sm" />
              Clear transaction cache
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Icon name="restart_alt" size="sm" />
              Reset performance metrics
            </Button>
          </div>
        </Card>
      </div>

      <Card
        tier="container-high"
        title="Access management"
        description="Usuários do sistema e seus perfis"
        action={
          <Button onClick={() => setIsUserModalOpen(true)}>
            <Icon name="person_add" size="sm" />
            Novo usuário
          </Button>
        }
      >
        {(() => {
          if (isLoading) {
            return (
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            );
          }
          if (users.length === 0) {
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
                    {`Atualizado: ${formatDateBR(systemUser.updatedAt)}`}
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

export default SettingsPage;
