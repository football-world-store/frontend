import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-metallic text-on-primary hover:bg-metallic-hover disabled:opacity-50 disabled:bg-none disabled:bg-surface-container-high disabled:text-on-surface-variant",
  secondary:
    "bg-surface-container-highest text-on-surface border-ghost hover:bg-surface-bright disabled:opacity-50",
  ghost:
    "bg-transparent text-on-surface hover:bg-surface-container-low disabled:opacity-50",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-xl font-label font-medium uppercase tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-focus-gold disabled:cursor-not-allowed";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      className = "",
      children,
      ...rest
    },
    ref,
  ) => {
    const composedClassName = [
      BASE_CLASSES,
      VARIANT_CLASSES[variant],
      SIZE_CLASSES[size],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        className={composedClassName}
        disabled={disabled || isLoading}
        {...rest}
      >
        {isLoading ? "Carregando..." : children}
      </button>
    );
  },
);

Button.displayName = "Button";
