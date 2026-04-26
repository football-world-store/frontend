import { type ReactNode } from "react";

import { Sidebar, TopBar } from "@/components/molecules";

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
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      <Sidebar />
      <div className="ml-64 px-8 pb-12">
        <TopBar title={title} subtitle={subtitle} />
        {toolbar ? <div className="mb-6">{toolbar}</div> : null}
        <main className="space-y-8">{children}</main>
      </div>
    </div>
  );
};
