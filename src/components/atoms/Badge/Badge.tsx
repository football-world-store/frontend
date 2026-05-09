import { type HTMLAttributes } from "react";

type BadgeTone = "primary" | "neutral" | "success" | "warning" | "error";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  primary:
    "bg-primary text-on-primary dark:bg-primary-container dark:text-on-primary-container",
  neutral:
    "bg-surface-container-high text-on-surface-variant dark:bg-surface-container-highest dark:text-on-surface-variant",
  success: "bg-tertiary-container text-on-tertiary-container",
  warning:
    "bg-primary-container text-on-primary-container dark:bg-primary-fixed-dim dark:text-on-primary-fixed",
  error: "bg-error-container text-on-error-container",
};

export const Badge = ({
  tone = "neutral",
  className = "",
  children,
  ...rest
}: BadgeProps) => {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-pill px-2.5 py-1 font-label text-[0.625rem] uppercase tracking-wider font-semibold",
        TONE_CLASSES[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </span>
  );
};
