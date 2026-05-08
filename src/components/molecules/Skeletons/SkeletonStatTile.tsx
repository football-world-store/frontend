import { type HTMLAttributes } from "react";

import { Skeleton, SkeletonText } from "@/components/atoms";

interface SkeletonStatTileProps extends HTMLAttributes<HTMLDivElement> {
  hero?: boolean;
}

export const SkeletonStatTile = ({
  hero = false,
  className = "",
  ...rest
}: SkeletonStatTileProps) => {
  const containerClass = hero
    ? "rounded-xl bg-surface-container-high p-6 pt-5 pb-7 flex flex-col gap-4 shadow-ambient min-h-[180px]"
    : "rounded-xl bg-surface-container-highest p-6 pt-5 pb-7 flex flex-col gap-4 shadow-ambient min-h-[148px]";

  return (
    <div
      aria-hidden
      className={[containerClass, className].filter(Boolean).join(" ")}
      {...rest}
    >
      <div className="flex items-start justify-between">
        <SkeletonText size="sm" width="md" />
        <Skeleton shape="rect" className="h-6 w-6" />
      </div>
      <SkeletonText size="lg" width="lg" className={hero ? "h-10" : "h-8"} />
    </div>
  );
};
