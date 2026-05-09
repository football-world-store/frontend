import { type HTMLAttributes } from "react";

import { SkeletonText } from "@/components/atoms";

type CardTier = "container" | "container-high" | "container-highest";

const TIER_CLASSES: Record<CardTier, string> = {
  container: "bg-surface-container",
  "container-high": "bg-surface-container-high",
  "container-highest": "bg-surface-container-highest",
};

interface SkeletonCardProps extends HTMLAttributes<HTMLDivElement> {
  tier?: CardTier;
  withHeader?: boolean;
  bodyLines?: number;
  minHeight?: string;
}

export const SkeletonCard = ({
  tier = "container",
  withHeader = true,
  bodyLines = 3,
  minHeight,
  className = "",
  ...rest
}: SkeletonCardProps) => (
  <div
    aria-hidden
    className={[
      "rounded-xl px-6 pt-5 pb-7 shadow-ambient",
      TIER_CLASSES[tier],
      className,
    ]
      .filter(Boolean)
      .join(" ")}
    style={minHeight ? { minHeight } : undefined}
    {...rest}
  >
    {withHeader ? (
      <div className="space-y-2 mb-5">
        <SkeletonText size="lg" width="md" />
        <SkeletonText size="sm" width="lg" />
      </div>
    ) : null}
    <div className="space-y-3">
      {Array.from({ length: bodyLines }).map((_, idx) => (
        <SkeletonText
          key={idx}
          size="md"
          width={idx === bodyLines - 1 ? "lg" : "full"}
        />
      ))}
    </div>
  </div>
);
