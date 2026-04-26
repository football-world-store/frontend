import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
  hasError?: boolean;
}

const BASE_CLASSES =
  "w-full h-12 rounded-xl bg-surface-container-lowest text-on-surface font-body text-sm px-4 pr-10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-focus-gold disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-no-repeat bg-[right_1rem_center]";

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { options, placeholder, hasError = false, className = "", ...rest },
    ref,
  ) => {
    return (
      <select
        ref={ref}
        className={[BASE_CLASSES, hasError ? "ring-focus-gold" : "", className]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  },
);

Select.displayName = "Select";
