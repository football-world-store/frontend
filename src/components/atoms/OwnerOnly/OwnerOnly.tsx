"use client";

import type { ReactNode } from "react";

import { usePermission } from "@/hooks";

interface OwnerOnlyProps {
  children: ReactNode;
}

export const OwnerOnly = ({ children }: OwnerOnlyProps) => {
  const { isOwner } = usePermission();
  return isOwner ? children : null;
};
