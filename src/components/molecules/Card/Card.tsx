import { type HTMLAttributes, type ReactNode } from "react";

type CardTier = "container" | "container-high" | "container-highest";

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  tier?: CardTier;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

const TIER_CLASSES: Record<CardTier, string> = {
  container: "bg-surface-container",
  "container-high": "bg-surface-container-high",
  "container-highest": "bg-surface-container-highest",
};

export const Card = ({
  tier = "container",
  title,
  description,
  action,
  className = "",
  children,
  ...rest
}: CardProps) => {
  const hasHeader = Boolean(title || description || action);
  return (
    <div
      className={[
        "rounded-xl p-6 shadow-ambient",
        TIER_CLASSES[tier],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {hasHeader ? (
        <header className="flex items-start justify-between gap-4 mb-4">
          <div className="space-y-1">
            {title ? (
              <h3 className="font-headline text-lg font-bold text-on-surface tracking-tight">
                {title}
              </h3>
            ) : null}
            {description ? (
              <p className="font-body text-sm text-on-surface-variant">
                {description}
              </p>
            ) : null}
          </div>
          {action ? <div>{action}</div> : null}
        </header>
      ) : null}
      {children}
    </div>
  );
};
