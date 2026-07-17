"use client";

import { type ReactNode } from "react";

import { CustomerAuthProvider } from "@/contexts";

interface PortalLayoutProps {
  children: ReactNode;
}

const PortalLayout = ({ children }: PortalLayoutProps) => {
  return <CustomerAuthProvider>{children}</CustomerAuthProvider>;
};

export default PortalLayout;
