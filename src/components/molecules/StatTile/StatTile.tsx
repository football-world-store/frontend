import { type HTMLAttributes } from "react";

import { Icon } from "@/components/atoms";

interface StatTileProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
  delta?: number;
  trend?: "up" | "down" | "flat";
  iconName?: string;
  hero?: boolean;
}

const TREND_CLASSES: Record<NonNullable<StatTileProps["trend"]>, string> = {
  up: "text-tertiary",
  down: "text-error",
  flat: "text-on-surface-variant",
};

const TREND_ICONS: Record<NonNullable<StatTileProps["trend"]>, string> = {
  up: "trending_up",
  down: "trending_down",
  flat: "trending_flat",
};

export const StatTile = ({
  label,
  value,
  delta,
  trend = "flat",
  iconName,
  hero = false,
  className = "",
  ...rest
}: StatTileProps) => {
  const containerClass = hero
    ? "rounded-xl bg-metallic text-on-primary p-6 pt-5 pb-7 flex flex-col gap-4 shadow-ambient"
    : "rounded-xl bg-surface-container-highest p-6 pt-5 pb-7 flex flex-col gap-4 shadow-ambient";
  const labelClass = hero
    ? "font-label uppercase tracking-wider text-xs text-on-primary/80"
    : "font-label uppercase tracking-wider text-xs text-on-surface-variant";
  const valueClass = hero
    ? "font-headline text-4xl xl:text-5xl font-extrabold text-on-primary tracking-[-0.04em] break-all"
    : "font-headline text-3xl font-extrabold text-on-surface tracking-[-0.03em]";
  const iconClass = hero ? "text-on-primary" : "text-on-surface-variant";

  return (
    <div
      className={[containerClass, className].filter(Boolean).join(" ")}
      {...rest}
    >
      <div className="flex items-start justify-between">
        <span className={labelClass}>{label}</span>
        {iconName ? (
          <Icon name={iconName} className={iconClass} size="md" />
        ) : null}
      </div>
      <strong className={valueClass}>{value}</strong>
      {delta !== undefined ? (
        <div className="flex items-center gap-1.5">
          <Icon
            name={TREND_ICONS[trend]}
            size="sm"
            className={hero ? "text-on-primary" : TREND_CLASSES[trend]}
          />
          <span
            className={`font-label text-xs font-semibold ${
              hero ? "text-on-primary" : TREND_CLASSES[trend]
            }`}
          >
            {delta > 0 ? "+" : ""}
            {delta}%
          </span>
          <span
            className={`font-label text-xs ${
              hero ? "text-on-primary/80" : "text-on-surface-variant"
            }`}
          >
            vs. semana passada
          </span>
        </div>
      ) : null}
    </div>
  );
};
