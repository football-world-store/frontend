import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

const BASE_CLASSES =
  "w-full h-12 rounded-xl bg-surface-container-lowest text-on-surface font-body text-sm placeholder:text-on-surface-variant px-4 transition-all duration-200 focus-visible:outline-none focus-visible:ring-focus-gold disabled:opacity-50 disabled:cursor-not-allowed";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ hasError = false, className = "", ...rest }, ref) => {
    const errorClasses = hasError ? "ring-2 ring-error/40" : "";
    return (
      <input
        ref={ref}
        className={[BASE_CLASSES, errorClasses, className]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      />
    );
  },
);

Input.displayName = "Input";
