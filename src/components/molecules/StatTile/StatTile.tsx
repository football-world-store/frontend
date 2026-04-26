import { type HTMLAttributes } from "react";

import { Icon } from "@/components/atoms";

interface StatTileProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
  delta?: number;
  trend?: "up" | "down" | "flat";
  iconName?: string;
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
  className = "",
  ...rest
}: StatTileProps) => {
  return (
    <div
      className={[
        "rounded-xl bg-surface-container-highest p-6 flex flex-col gap-4 shadow-ambient",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      <div className="flex items-start justify-between">
        <span className="font-label uppercase tracking-wider text-xs text-on-surface-variant">
          {label}
        </span>
        {iconName ? (
          <Icon name={iconName} className="text-primary" size="md" />
        ) : null}
      </div>
      <strong className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">
        {value}
      </strong>
      {delta !== undefined ? (
        <div className="flex items-center gap-1.5">
          <Icon
            name={TREND_ICONS[trend]}
            size="sm"
            className={TREND_CLASSES[trend]}
          />
          <span
            className={`font-label text-xs font-semibold ${TREND_CLASSES[trend]}`}
          >
            {delta > 0 ? "+" : ""}
            {delta}%
          </span>
          <span className="font-label text-xs text-on-surface-variant">
            vs. semana passada
          </span>
        </div>
      ) : null}
    </div>
  );
};
