"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";

import { Icon } from "@/components/atoms";
import { FormField } from "@/components/molecules/FormField";

interface PasswordFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: string;
  error?: string;
  hint?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  (props, ref) => {
    const [visible, setVisible] = useState(false);
    const toggle = () => setVisible((prev) => !prev);

    return (
      <FormField
        ref={ref}
        type={visible ? "text" : "password"}
        autoComplete="current-password"
        trailing={
          <button
            type="button"
            onClick={toggle}
            aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
            className="text-on-surface-variant hover:text-on-surface transition-colors focus-visible:outline-none focus-visible:ring-focus-gold rounded-default p-1"
          >
            <Icon name={visible ? "visibility_off" : "visibility"} size="sm" />
          </button>
        }
        {...props}
      />
    );
  },
);

PasswordField.displayName = "PasswordField";
