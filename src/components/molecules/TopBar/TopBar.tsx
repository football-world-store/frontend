"use client";

import { type ReactNode } from "react";

import { Avatar, Badge, Icon, IconButton } from "@/components/atoms";
import { useAuth } from "@/contexts";
import { useAlertsQuery, useProductsQuery } from "@/hooks/queries";

interface TopBarProps {
  title: ReactNode;
  subtitle?: ReactNode;
}

export const TopBar = ({ title, subtitle }: TopBarProps) => {
  const { user, signOut } = useAuth();
  const { data: alerts } = useAlertsQuery();
  const { data: productsResult } = useProductsQuery();

  const lowStockCount = (productsResult?.items ?? []).filter(
    (product) => product.quantity <= product.minStock,
  ).length;
  const pendingAlerts = (alerts ?? []).filter(
    (alert) => !alert.acknowledgedAt,
  ).length;

  return (
    <header className="flex items-center justify-between gap-6 py-6">
      <div className="space-y-1">
        <h1 className="font-headline text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
          {title}
        </h1>
        {subtitle ? (
          <p className="font-body text-sm text-on-surface-variant">
            {subtitle}
          </p>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        {lowStockCount > 0 ? (
          <Badge tone="error" className="gap-1.5">
            <Icon name="warning" size="sm" />
            {lowStockCount} low stock
          </Badge>
        ) : null}
        <div className="relative">
          <IconButton iconName="notifications" label="Notificações" />
          {pendingAlerts > 0 ? (
            <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-error text-on-error font-label text-[0.625rem] font-bold">
              {pendingAlerts}
            </span>
          ) : null}
        </div>
        <IconButton iconName="search" label="Buscar" />
        <div className="flex items-center gap-3 pl-3 ml-1">
          {user ? <Avatar name={user.name} /> : null}
          <IconButton
            iconName="logout"
            label="Sair"
            onClick={() => signOut()}
          />
        </div>
      </div>
    </header>
  );
};
