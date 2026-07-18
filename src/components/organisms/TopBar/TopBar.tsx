"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

import { Avatar, Badge, Icon, IconButton } from "@/components/atoms";
import { AlertsPanel } from "@/components/organisms/AlertsPanel";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { Modal } from "@/components/atoms/Modal";
import { APP_ROUTES } from "@/constants";
import { useAuth } from "@/contexts";
import { useAlertsCountQuery } from "@/hooks/queries";

interface TopBarProps {
  title: ReactNode;
  subtitle?: ReactNode;
}

export const TopBar = ({ title, subtitle }: TopBarProps) => {
  const { user, signOut, isSigningOut } = useAuth();
  const { data: alertsCount } = useAlertsCountQuery();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleConfirmLogout = () => {
    setIsLogoutConfirmOpen(false);
    signOut();
  };

  const lowStockCount = alertsCount?.critical ?? 0;
  const pendingAlerts = alertsCount?.total ?? 0;

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 md:gap-6 py-6">
      <div className="min-w-0 space-y-1">
        <h1 className="font-headline text-2xl md:text-3xl font-extrabold text-on-surface tracking-[-0.04em]">
          {title}
        </h1>
        {subtitle ? (
          <p className="hidden sm:block font-body text-sm text-on-surface-variant">
            {subtitle}
          </p>
        ) : null}
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        {lowStockCount > 0 ? (
          <span className="hidden md:inline-flex">
            <Badge tone="error" className="gap-1.5">
              <Icon name="warning" size="sm" />
              {lowStockCount} low stock
            </Badge>
          </span>
        ) : null}
        <div className="relative">
          <IconButton
            iconName="notifications"
            label="Notificações"
            onClick={() => setIsNotificationsOpen(true)}
          />
          {pendingAlerts > 0 ? (
            <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-error text-on-error font-label text-[0.625rem] font-bold">
              {pendingAlerts}
            </span>
          ) : null}
        </div>
        <div className="hidden md:flex items-center gap-2 md:gap-3 pl-2 md:pl-3 ml-1">
          {user ? <Avatar name={user.name} /> : null}
          <IconButton
            iconName="logout"
            label="Sair"
            isLoading={isSigningOut}
            onClick={() => setIsLogoutConfirmOpen(true)}
          />
        </div>
      </div>
      <ConfirmDialog
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Sair da conta?"
        description="Você precisará fazer login novamente para acessar o painel."
        confirmLabel="Sair"
        cancelLabel="Continuar logado"
        isPending={isSigningOut}
      />
      <Modal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        title="Notificações"
        footer={
          <Link
            href={APP_ROUTES.app.alerts}
            onClick={() => setIsNotificationsOpen(false)}
            className="font-label text-xs uppercase tracking-widest text-primary hover:underline focus-visible:outline-none focus-visible:ring-focus-gold rounded-lg px-1"
          >
            Ver todos os alertas
          </Link>
        }
      >
        <AlertsPanel inline />
      </Modal>
    </header>
  );
};
