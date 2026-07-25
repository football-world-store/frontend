"use client";

import { useTheme } from "next-themes";
import { useState } from "react";

import {
  Avatar,
  Badge,
  Button,
  Icon,
  IconButton,
  Modal,
  OwnerOnly,
  Select,
} from "@/components/atoms";
import {
  Card,
  ConfirmDialog,
  EmptyState,
  SkeletonListRow,
} from "@/components/molecules";
import {
  ChangePasswordForm,
  ManagerProfileCard,
  MonthlyReportModal,
  UserForm,
} from "@/components/organisms";
import { DashboardLayout } from "@/components/templates";
import { useAuth } from "@/contexts";
import {
  useClearSessionsMutation,
  useDeleteUserMutation,
  useUpdateCustomerMutation,
  useUpdateUserMutation,
} from "@/hooks/mutations";
import { useCustomersQuery, useUsersQuery } from "@/hooks/queries";
import { formatDateBR } from "@/utils";

const ROLE_LABEL = {
  OWNER: "Dono",
  EMPLOYEE: "Funcionário",
} as const;

const SettingsPage = () => {
  const { user } = useAuth();
  const { data, isLoading } = useUsersQuery({ isActive: true });
  const users = data?.items ?? [];
  const { data: pendingData, isLoading: isPendingLoading } = useUsersQuery({
    isActive: false,
    limit: 50,
  });
  const pendingUsers = pendingData?.items ?? [];
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [pendingDeleteUserId, setPendingDeleteUserId] = useState<string | null>(
    null,
  );
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isClearSessionsOpen, setIsClearSessionsOpen] = useState(false);
  const [isMonthlyReportOpen, setIsMonthlyReportOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const { data: pendingCustomersData, isLoading: isPendingCustomersLoading } =
    useCustomersQuery({ pendingOnly: true, limit: 50 });
  const pendingCustomers = pendingCustomersData?.items ?? [];

  const deleteUserMutation = useDeleteUserMutation();
  const clearSessionsMutation = useClearSessionsMutation();
  const approveUserMutation = useUpdateUserMutation();
  const approveCustomerMutation = useUpdateCustomerMutation();

  const pendingDeleteUser = pendingDeleteUserId
    ? (users.find((u) => u.id === pendingDeleteUserId) ?? null)
    : null;
  const editingUser = editingUserId
    ? (users.find((u) => u.id === editingUserId) ?? null)
    : null;

  const handleConfirmDeleteUser = () => {
    if (!pendingDeleteUserId) return;
    deleteUserMutation.mutate(pendingDeleteUserId, {
      onSettled: () => setPendingDeleteUserId(null),
    });
  };

  const handleConfirmClearSessions = () => {
    clearSessionsMutation.mutate(undefined, {
      onSettled: () => setIsClearSessionsOpen(false),
    });
  };

  return (
    <DashboardLayout
      title={
        <>
          <span className="font-label text-xs uppercase tracking-widest text-primary block">
            Painel de Controle
          </span>
          CONFIGURAÇÕES DO SISTEMA
        </>
      }
      subtitle="Gerencie usuários, preferências e operações do sistema."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ManagerProfileCard
          user={user}
          onChangePassword={() => setIsChangePasswordOpen(true)}
        />

        <Card tier="container-high" title="Preferências do sistema">
          <ul className="space-y-4">
            <li className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm text-on-surface">Tema visual</p>
                <p className="font-label text-xs text-on-surface-variant">
                  Apenas escuro ou seguir sistema (prévia)
                </p>
              </div>
              <Select
                options={[
                  { value: "dark", label: "Escuro" },
                  { value: "light", label: "Claro" },
                  { value: "system", label: "Sistema" },
                ]}
                value={theme ?? "dark"}
                onChange={(e) => setTheme(e.target.value)}
                className="w-32"
              />
            </li>
          </ul>
        </Card>

        <Card tier="container-high" title="Ações críticas">
          <div className="space-y-3">
            <OwnerOnly>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                onClick={() => setIsMonthlyReportOpen(true)}
              >
                <Icon name="summarize" size="sm" filled={false} />
                Relatório mensal
              </Button>
            </OwnerOnly>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={() => setIsClearSessionsOpen(true)}
            >
              <Icon name="logout" size="sm" />
              Encerrar todas as sessões
            </Button>
            <p className="font-label text-xs text-on-surface-variant">
              Desconecta todos os dispositivos. Você precisará entrar novamente.
            </p>
          </div>
        </Card>
      </div>

      {(isPendingCustomersLoading || pendingCustomers.length > 0) && (
        <Card
          tier="container-high"
          title="Clientes pendentes"
          description="Clientes que se cadastraram pelo portal e aguardam aprovação."
        >
          {isPendingCustomersLoading ? (
            <SkeletonListRow count={2} withAvatar />
          ) : (
            <ul className="space-y-2">
              {pendingCustomers.map((customer, index) => (
                <li
                  key={customer.id}
                  className={`flex items-center gap-4 rounded-xl px-4 py-3 ${
                    index % 2 === 0
                      ? "bg-surface-container-low"
                      : "bg-surface-container"
                  }`}
                >
                  <Avatar name={customer.name} />
                  <div className="flex-1">
                    <p className="font-body text-sm font-semibold text-on-surface">
                      {customer.name}
                    </p>
                    <p className="font-label text-xs text-on-surface-variant">
                      {customer.email ?? "—"}
                    </p>
                  </div>
                  <Badge tone="neutral">Pendente</Badge>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      approveCustomerMutation.mutate({
                        id: customer.id,
                        isActive: true,
                      })
                    }
                    disabled={approveCustomerMutation.isPending}
                  >
                    <Icon name="check_circle" size="sm" filled={false} />
                    Aprovar
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {(isPendingLoading || pendingUsers.length > 0) && (
        <Card
          tier="container-high"
          title="Aprovações pendentes"
          description="Usuários que se cadastraram e aguardam liberação de acesso."
        >
          {isPendingLoading ? (
            <SkeletonListRow count={2} withAvatar />
          ) : (
            <ul className="space-y-2">
              {pendingUsers.map((pendingUser, index) => (
                <li
                  key={pendingUser.id}
                  className={`flex items-center gap-4 rounded-xl px-4 py-3 ${
                    index % 2 === 0
                      ? "bg-surface-container-low"
                      : "bg-surface-container"
                  }`}
                >
                  <Avatar name={pendingUser.name} />
                  <div className="flex-1">
                    <p className="font-body text-sm font-semibold text-on-surface">
                      {pendingUser.name}
                    </p>
                    <p className="font-label text-xs text-on-surface-variant">
                      {pendingUser.email}
                    </p>
                  </div>
                  <Badge tone="neutral">Pendente</Badge>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      approveUserMutation.mutate({
                        id: pendingUser.id,
                        isActive: true,
                      })
                    }
                    disabled={approveUserMutation.isPending}
                  >
                    <Icon name="check_circle" size="sm" filled={false} />
                    Aprovar
                  </Button>
                  <IconButton
                    iconName="delete"
                    label={`Rejeitar ${pendingUser.name}`}
                    filled={false}
                    onClick={() => setPendingDeleteUserId(pendingUser.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      <Card
        tier="container-high"
        title="Gestão de acesso"
        description="Usuários do sistema e seus perfis"
        action={
          <Button
            onClick={() => setIsUserModalOpen(true)}
            className="w-full md:w-auto"
          >
            <Icon name="person_add" size="sm" />
            Novo usuário
          </Button>
        }
      >
        {(() => {
          if (isLoading) {
            return <SkeletonListRow count={4} withAvatar />;
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
                  <IconButton
                    iconName="edit"
                    label={`Editar ${systemUser.name}`}
                    filled={false}
                    onClick={() => setEditingUserId(systemUser.id)}
                  />
                  {systemUser.id !== user?.id ? (
                    <IconButton
                      iconName="delete"
                      label={`Excluir ${systemUser.name}`}
                      filled={false}
                      onClick={() => setPendingDeleteUserId(systemUser.id)}
                    />
                  ) : null}
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

      <Modal
        isOpen={editingUser !== null}
        onClose={() => setEditingUserId(null)}
        title="Editar usuário"
        description={editingUser ? editingUser.email : undefined}
        size="lg"
      >
        {editingUser ? (
          <UserForm
            user={editingUser}
            isSelf={editingUser.id === user?.id}
            onSuccess={() => setEditingUserId(null)}
            onCancel={() => setEditingUserId(null)}
          />
        ) : null}
      </Modal>

      <Modal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        title="Trocar senha"
        description="Após salvar, você precisará entrar novamente com a nova senha."
        size="md"
      >
        <ChangePasswordForm
          onSuccess={() => setIsChangePasswordOpen(false)}
          onCancel={() => setIsChangePasswordOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={pendingDeleteUserId !== null}
        onClose={() => setPendingDeleteUserId(null)}
        onConfirm={handleConfirmDeleteUser}
        title="Excluir usuário?"
        description={
          pendingDeleteUser
            ? `O usuário "${pendingDeleteUser.name}" perderá acesso imediatamente. Esta ação não pode ser desfeita.`
            : undefined
        }
        confirmLabel="Excluir"
        tone="danger"
        isPending={deleteUserMutation.isPending}
      />

      <MonthlyReportModal
        isOpen={isMonthlyReportOpen}
        onClose={() => setIsMonthlyReportOpen(false)}
      />

      <ConfirmDialog
        isOpen={isClearSessionsOpen}
        onClose={() => setIsClearSessionsOpen(false)}
        onConfirm={handleConfirmClearSessions}
        title="Encerrar todas as sessões?"
        description="Todos os dispositivos (incluindo este) serão deslogados. Você precisará entrar novamente."
        confirmLabel="Encerrar tudo"
        tone="danger"
        isPending={clearSessionsMutation.isPending}
      />
    </DashboardLayout>
  );
};

export default SettingsPage;
