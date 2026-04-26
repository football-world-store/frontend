import { FormError } from "@/components/atoms/FormError";

interface FieldFooterProps {
  fieldId?: string;
  error?: string;
  hint?: string;
}

export const FieldFooter = ({ fieldId, error, hint }: FieldFooterProps) => {
  if (error) return <FormError id={`${fieldId}-error`} message={error} />;
  if (hint)
    return <p className="font-label text-on-surface-variant text-xs">{hint}</p>;
  return null;
};
