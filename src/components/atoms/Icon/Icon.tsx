import { type HTMLAttributes } from "react";

type IconSize = "sm" | "md" | "lg";

interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: IconSize;
  filled?: boolean;
}

const SIZE_CLASSES: Record<IconSize, string> = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
};

export const Icon = ({
  name,
  size = "md",
  filled = true,
  className = "",
  style,
  ...rest
}: IconProps) => {
  const fontVariation = filled
    ? "'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 24"
    : "'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 24";
  return (
    <span
      aria-hidden
      className={["material-symbols-outlined", SIZE_CLASSES[size], className]
        .filter(Boolean)
        .join(" ")}
      style={{ fontVariationSettings: fontVariation, ...style }}
      {...rest}
    >
      {name}
    </span>
  );
};
