"use client";

import { type ReactNode } from "react";

import { BottomNav, Header, Sidebar, TopBar } from "@/components/molecules";
import { useIsMobile } from "@/hooks";

interface DashboardLayoutProps {
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  toolbar?: ReactNode;
}

export const DashboardLayout = ({
  title,
  subtitle,
  toolbar,
  children,
}: DashboardLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      {!isMobile && <Sidebar />}
      <div className="flex flex-col md:ml-64">
        {isMobile && <Header />}
        <div className="flex-1 px-4 md:px-8 pb-24 md:pb-12">
          <TopBar title={title} subtitle={subtitle} />
          {toolbar ? <div className="mb-6">{toolbar}</div> : null}
          <main className="space-y-8">{children}</main>
        </div>
      </div>
      {isMobile && <BottomNav />}
    </div>
  );
};
