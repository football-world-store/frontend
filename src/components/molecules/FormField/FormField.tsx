import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

import { FieldFooter, Input, Label } from "@/components/atoms";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  trailing?: ReactNode;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    { label, error, hint, trailing, className = "", id, ...inputProps },
    ref,
  ) => {
    const fieldId = id ?? inputProps.name;
    const wrapperClassName = ["flex flex-col gap-1.5", className]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={wrapperClassName}>
        <Label htmlFor={fieldId}>{label}</Label>
        <div className="relative">
          <Input
            ref={ref}
            id={fieldId}
            hasError={Boolean(error)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className={trailing ? "pr-12" : undefined}
            {...inputProps}
          />
          {trailing ? (
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center">
              {trailing}
            </div>
          ) : null}
        </div>
        <FieldFooter fieldId={fieldId} error={error} hint={hint} />
      </div>
    );
  },
);

FormField.displayName = "FormField";
