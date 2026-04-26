import { type LabelHTMLAttributes } from "react";

export const Label = ({
  className = "",
  children,
  ...rest
}: LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    <label
      className={[
        "font-label text-on-surface-variant text-xs uppercase tracking-wider",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </label>
  );
};
