import { type HTMLAttributes } from "react";

type BadgeTone = "primary" | "neutral" | "success" | "warning" | "error";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  primary: "bg-primary-container text-on-primary",
  neutral: "bg-surface-container-highest text-on-surface-variant",
  success: "bg-tertiary-container text-on-tertiary",
  warning: "bg-primary-fixed-dim text-on-primary-fixed",
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
