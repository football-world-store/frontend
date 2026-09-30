import { type ReactNode } from "react";

export function generateStaticParams() {
  return [];
}

export default function SaleLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
