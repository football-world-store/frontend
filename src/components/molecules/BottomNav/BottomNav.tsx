"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Icon } from "@/components/atoms";
import { Modal } from "@/components/atoms/Modal";
import { NAV_ITEMS, type NavItem } from "@/constants";

const PRIMARY_ITEMS = NAV_ITEMS.filter((item) => item.primaryOnMobile);
const OVERFLOW_ITEMS = NAV_ITEMS.filter((item) => !item.primaryOnMobile);

const ACTIVE_TEXT_CLASS = "text-primary";
const INACTIVE_TEXT_CLASS = "text-on-surface-variant";

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
  onNavigate?: () => void;
}

const NavLink = ({ item, isActive, onNavigate }: NavLinkProps) => (
  <Link
    href={item.href}
    aria-current={isActive ? "page" : undefined}
    onClick={onNavigate}
    className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors focus-visible:outline-none focus-visible:ring-focus-gold"
  >
    <Icon
      name={item.icon}
      size="sm"
      filled={isActive}
      className={isActive ? ACTIVE_TEXT_CLASS : INACTIVE_TEXT_CLASS}
    />
    <span
      className={`font-label text-[0.625rem] uppercase tracking-wider ${
        isActive ? ACTIVE_TEXT_CLASS : INACTIVE_TEXT_CLASS
      }`}
    >
      {item.label}
    </span>
  </Link>
);

export const BottomNav = () => {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const isOverflowActive = OVERFLOW_ITEMS.some((item) =>
    pathname.startsWith(item.href),
  );

  return (
    <>
      <nav className="fixed bottom-0 inset-x-0 z-50 h-16 bg-surface-container-low flex items-center justify-around border-t border-outline-variant">
        {PRIMARY_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={pathname.startsWith(item.href)}
          />
        ))}
        <button
          type="button"
          aria-expanded={isMoreOpen}
          aria-label="Mais opções de navegação"
          onClick={() => setIsMoreOpen(true)}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors focus-visible:outline-none focus-visible:ring-focus-gold"
        >
          <Icon
            name="more_horiz"
            size="sm"
            filled={isOverflowActive}
            className={
              isOverflowActive ? ACTIVE_TEXT_CLASS : INACTIVE_TEXT_CLASS
            }
          />
          <span
            className={`font-label text-[0.625rem] uppercase tracking-wider ${
              isOverflowActive ? ACTIVE_TEXT_CLASS : INACTIVE_TEXT_CLASS
            }`}
          >
            Mais
          </span>
        </button>
      </nav>
      <Modal
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
        title="Mais opções"
        size="md"
      >
        <ul className="space-y-1">
          {OVERFLOW_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsMoreOpen(false)}
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
              </li>
            );
          })}
        </ul>
      </Modal>
    </>
  );
};
