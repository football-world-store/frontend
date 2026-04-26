import { type HTMLAttributes } from "react";

/** Quantos slashes do indicador ficam dourados (0 = vazio, 3 = cheio). */
export type ClawLevel = 0 | 1 | 2 | 3;

interface ClawIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  level: ClawLevel;
}

export const ClawIndicator = ({
  level,
  className = "",
  ...rest
}: ClawIndicatorProps) => {
  return (
    <div
      aria-label={`Nível ${level} de 3`}
      className={["flex items-center gap-1", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className={`block h-3 w-1 -skew-x-12 rounded-default ${
            index < level ? "bg-primary" : "bg-surface-variant"
          }`}
        />
      ))}
    </div>
  );
};
