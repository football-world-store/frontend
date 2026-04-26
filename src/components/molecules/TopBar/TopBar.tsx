"use client";

import { type ReactNode } from "react";

import { Avatar, IconButton } from "@/components/atoms";
import { useAuth, useUI } from "@/contexts";
import { useAlertsQuery } from "@/hooks/queries";

interface TopBarProps {
  title: ReactNode;
  subtitle?: ReactNode;
}

export const TopBar = ({ title, subtitle }: TopBarProps) => {
  const { user, signOut } = useAuth();
  const { toggleSidebar } = useUI();
  const { data: alerts } = useAlertsQuery();

  const pendingAlerts = (alerts ?? []).filter(
    (alert) => !alert.acknowledgedAt,
  ).length;

  return (
    <header className="flex items-center justify-between gap-4 py-6">
      <div className="flex items-center gap-3">
        <IconButton
          iconName="menu"
          label="Abrir menu"
          className="lg:hidden"
          onClick={toggleSidebar}
        />
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
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <div className="relative">
          <IconButton iconName="notifications" label="Notificações" />
          {pendingAlerts > 0 ? (
            <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-error text-on-error font-label text-[0.625rem] font-bold">
              {pendingAlerts}
            </span>
          ) : null}
        </div>
        <IconButton
          iconName="search"
          label="Buscar"
          className="hidden md:inline-flex"
        />
        <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-3 ml-1">
          {user ? <Avatar name={user.name} className="hidden md:flex" /> : null}
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
