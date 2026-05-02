"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icon, Logo } from "@/components/atoms";
import { NAV_ITEMS } from "@/constants";

export const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-surface-container-low h-screen fixed left-0 top-0 z-40 flex flex-col py-6">
      <div className="px-6 mb-8 flex items-center justify-center">
        <Logo size="sm" variant="compact" />
      </div>
      <nav className="flex-1 flex flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={[
                "flex items-center gap-3 px-4 py-3 rounded-xl font-headline font-bold tracking-tight uppercase text-sm transition-colors focus-visible:outline-none focus-visible:ring-focus-gold",
                isActive
                  ? "bg-surface-container-highest text-primary"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
              ].join(" ")}
            >
              <Icon name={item.icon} filled={isActive} size="md" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
