import { SkeletonAvatar, SkeletonText } from "@/components/atoms";

interface SkeletonListRowProps {
  count?: number;
  withAvatar?: boolean;
  withTrailingValue?: boolean;
}

const TIER_BY_INDEX = [
  "bg-surface-container-low",
  "bg-surface-container",
] as const;

export const SkeletonListRow = ({
  count = 5,
  withAvatar = false,
  withTrailingValue = true,
}: SkeletonListRowProps) => (
  <ul aria-hidden className="space-y-2">
    {Array.from({ length: count }).map((_, idx) => (
      <li
        key={idx}
        className={`${TIER_BY_INDEX[idx % 2]} rounded-xl px-4 py-3 flex items-center gap-4`}
      >
        {withAvatar ? <SkeletonAvatar size="md" /> : null}
        <div className="flex-1 space-y-2 min-w-0">
          <SkeletonText size="md" width="lg" />
          <SkeletonText size="sm" width="md" />
        </div>
        {withTrailingValue ? (
          <div className="text-right space-y-2 hidden sm:block">
            <SkeletonText size="sm" width="full" className="w-20" />
            <SkeletonText size="md" width="full" className="w-24" />
          </div>
        ) : null}
      </li>
    ))}
  </ul>
);
