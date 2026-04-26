import { type ButtonHTMLAttributes, forwardRef } from "react";

import { Icon } from "@/components/atoms/Icon";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconName: string;
  label: string;
  filled?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ iconName, label, filled = true, className = "", ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        className={[
          "h-10 w-10 inline-flex items-center justify-center rounded-xl bg-surface-container-highest text-on-surface-variant hover:bg-surface-bright hover:text-on-surface transition-colors focus-visible:outline-none focus-visible:ring-focus-gold",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      >
        <Icon name={iconName} filled={filled} size="md" />
      </button>
    );
  },
);

IconButton.displayName = "IconButton";
