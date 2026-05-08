import { Skeleton, SkeletonText } from "@/components/atoms";

interface SkeletonFormProps {
  fields?: number;
  withSubmit?: boolean;
}

export const SkeletonForm = ({
  fields = 4,
  withSubmit = true,
}: SkeletonFormProps) => (
  <div aria-hidden className="space-y-5">
    {Array.from({ length: fields }).map((_, idx) => (
      <div key={idx} className="space-y-2">
        <SkeletonText size="sm" width="sm" />
        <Skeleton
          shape="rect"
          className="h-11 w-full bg-surface-container-lowest"
        />
      </div>
    ))}
    {withSubmit ? (
      <div className="flex justify-end pt-2">
        <Skeleton shape="rect" className="h-11 w-40" />
      </div>
    ) : null}
  </div>
);
