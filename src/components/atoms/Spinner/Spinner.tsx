import { type HTMLAttributes } from "react";

type SpinnerSize = "sm" | "md" | "lg";

interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  tone?: "primary" | "on-primary" | "on-surface";
}

const SIZE_CLASSES: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[0.1875rem]",
};

const TONE_CLASSES: Record<NonNullable<SpinnerProps["tone"]>, string> = {
  primary: "border-primary border-t-transparent",
  "on-primary": "border-on-primary border-t-transparent",
  "on-surface": "border-on-surface border-t-transparent",
};

export const Spinner = ({
  size = "md",
  tone = "primary",
  className = "",
  ...rest
}: SpinnerProps) => {
  return (
    <span
      role="status"
      aria-label="Carregando"
      className={[
        "inline-block animate-spin rounded-full",
        SIZE_CLASSES[size],
        TONE_CLASSES[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    />
  );
};
