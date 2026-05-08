import { type HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  shape?: "rect" | "pill" | "circle";
}

const SHAPE_CLASSES: Record<NonNullable<SkeletonProps["shape"]>, string> = {
  rect: "rounded-xl",
  pill: "rounded-pill",
  circle: "rounded-full",
};

export const Skeleton = ({
  shape = "rect",
  className = "",
  ...rest
}: SkeletonProps) => (
  <div
    aria-hidden
    className={[
      "animate-pulse bg-surface-container-highest",
      SHAPE_CLASSES[shape],
      className,
    ]
      .filter(Boolean)
      .join(" ")}
    {...rest}
  />
);
