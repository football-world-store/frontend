import { forwardRef, type SelectHTMLAttributes } from "react";

import { FieldFooter, Label, Select } from "@/components/atoms";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    { label, options, error, hint, placeholder, className = "", id, ...rest },
    ref,
  ) => {
    const fieldId = id ?? rest.name;
    return (
      <div
        className={["flex flex-col gap-1.5", className]
          .filter(Boolean)
          .join(" ")}
      >
        <Label htmlFor={fieldId}>{label}</Label>
        <Select
          ref={ref}
          id={fieldId}
          options={options}
          placeholder={placeholder}
          hasError={Boolean(error)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...rest}
        />
        <FieldFooter fieldId={fieldId} error={error} hint={hint} />
      </div>
    );
  },
);

SelectField.displayName = "SelectField";
