"use client";

import Link from "next/link";

import { Logo } from "@/components/atoms";
import { APP_ROUTES } from "@/constants";

export const Header = () => {
  return (
    <header className="flex items-center justify-center bg-surface-container-low px-4 py-4 border-b border-outline-variant">
      <Link
        href={APP_ROUTES.app.dashboard}
        className="focus-visible:outline-none focus-visible:ring-focus-gold rounded-lg"
      >
        <Logo size="sm" variant="compact" />
      </Link>
    </header>
  );
};
