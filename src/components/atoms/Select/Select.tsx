import { forwardRef, type SelectHTMLAttributes } from "react";

import { ON_SURFACE_VARIANT_COLOR } from "@/constants";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
  hasError?: boolean;
}

const CHEVRON_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23${ON_SURFACE_VARIANT_COLOR.slice(1)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`;

const BASE_CLASSES = `w-full h-12 rounded-xl bg-surface-container-lowest text-on-surface font-body text-sm px-4 pr-10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-focus-gold disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length_1rem]`;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { options, placeholder, hasError = false, className = "", ...rest },
    ref,
  ) => {
    return (
      <select
        ref={ref}
        style={{ backgroundImage: CHEVRON_SVG }}
        className={[
          BASE_CLASSES,
          hasError ? "ring-2 ring-error/40" : "",
          className,
        ]
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
