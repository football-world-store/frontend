import { type ReactNode } from "react";
import OwnerGuard from "@/components/guards/OwnerGuard";

export default function OwnerOnlyLayout({ children }: { children: ReactNode }) {
  return <OwnerGuard>{children}</OwnerGuard>;
}
