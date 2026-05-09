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

type SkeletonTextWidth = "full" | "lg" | "md" | "sm" | "xs";

const TEXT_WIDTH_CLASSES: Record<SkeletonTextWidth, string> = {
  full: "w-full",
  lg: "w-3/4",
  md: "w-1/2",
  sm: "w-1/3",
  xs: "w-1/5",
};

interface SkeletonTextProps extends HTMLAttributes<HTMLDivElement> {
  width?: SkeletonTextWidth;
  size?: "sm" | "md" | "lg";
}

const TEXT_HEIGHT_CLASSES: Record<
  NonNullable<SkeletonTextProps["size"]>,
  string
> = {
  sm: "h-3",
  md: "h-4",
  lg: "h-5",
};

export const SkeletonText = ({
  width = "full",
  size = "md",
  className = "",
  ...rest
}: SkeletonTextProps) => (
  <Skeleton
    shape="pill"
    className={[TEXT_HEIGHT_CLASSES[size], TEXT_WIDTH_CLASSES[width], className]
      .filter(Boolean)
      .join(" ")}
    {...rest}
  />
);

interface SkeletonAvatarProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const AVATAR_SIZE_CLASSES: Record<
  NonNullable<SkeletonAvatarProps["size"]>,
  string
> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export const SkeletonAvatar = ({
  size = "md",
  className = "",
  ...rest
}: SkeletonAvatarProps) => (
  <Skeleton
    shape="circle"
    className={[AVATAR_SIZE_CLASSES[size], className].filter(Boolean).join(" ")}
    {...rest}
  />
);
