import { type HTMLAttributes } from "react";

interface FormErrorProps extends HTMLAttributes<HTMLParagraphElement> {
  message?: string;
}

export const FormError = ({
  message,
  className = "",
  ...rest
}: FormErrorProps) => {
  if (!message) return null;
  return (
    <p
      role="alert"
      className={["font-label text-xs text-error mt-1", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {message}
    </p>
  );
};
