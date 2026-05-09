"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icon } from "@/components/atoms";
import { NAV_ITEMS } from "@/constants";

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 h-16 bg-surface-container-low flex items-center justify-around border-t border-outline-variant">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors focus-visible:outline-none focus-visible:ring-focus-gold"
          >
            <Icon
              name={item.icon}
              size="sm"
              filled={isActive}
              className={isActive ? "text-primary" : "text-on-surface-variant"}
            />
            <span
              className={`font-label text-[0.625rem] uppercase tracking-wider ${
                isActive ? "text-primary" : "text-on-surface-variant"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
