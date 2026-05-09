"use client";

import { useState, type ReactNode } from "react";

import { Avatar, Badge, Icon, IconButton } from "@/components/atoms";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { useAuth } from "@/contexts";
import { useAlertsCountQuery, useProductsQuery } from "@/hooks/queries";

interface TopBarProps {
  title: ReactNode;
  subtitle?: ReactNode;
}

export const TopBar = ({ title, subtitle }: TopBarProps) => {
  const { user, signOut, isSigningOut } = useAuth();
  const { data: alertsCount } = useAlertsCountQuery();
  const { data: productsResult } = useProductsQuery();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const handleConfirmLogout = () => {
    setIsLogoutConfirmOpen(false);
    signOut();
  };

  const lowStockCount = (productsResult?.items ?? []).filter(
    (product) => product.quantity <= product.minStock,
  ).length;
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
          <IconButton iconName="notifications" label="Notificações" />
          {pendingAlerts > 0 ? (
            <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-error text-on-error font-label text-[0.625rem] font-bold">
              {pendingAlerts}
            </span>
          ) : null}
        </div>
        <span className="hidden md:inline-flex">
          <IconButton iconName="search" label="Buscar" />
        </span>
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
    </header>
  );
};
