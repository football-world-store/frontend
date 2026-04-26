import { type ReactNode } from "react";

import { Icon } from "@/components/atoms";

interface EmptyStateProps {
  iconName?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({
  iconName = "inbox",
  title,
  description,
  action,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
      <div className="h-16 w-16 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
        <Icon name={iconName} size="lg" />
      </div>
      <div className="space-y-1">
        <h3 className="font-headline text-lg font-bold text-on-surface">
          {title}
        </h3>
        {description ? (
          <p className="font-body text-sm text-on-surface-variant max-w-sm">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
};
