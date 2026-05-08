import { SkeletonText } from "@/components/atoms";

interface SkeletonTableRowProps {
  count?: number;
  cells?: number;
}

const TIER_BY_INDEX = [
  "bg-surface-container-low",
  "bg-surface-container",
] as const;

const cellWidth = (cellIdx: number, totalCells: number): "lg" | "md" | "sm" => {
  if (cellIdx === 0) return "lg";
  if (cellIdx === totalCells - 1) return "sm";
  return "md";
};

export const SkeletonTableRow = ({
  count = 5,
  cells = 4,
}: SkeletonTableRowProps) => (
  <div aria-hidden className="space-y-2">
    {Array.from({ length: count }).map((_, rowIdx) => (
      <div
        key={rowIdx}
        className={`${TIER_BY_INDEX[rowIdx % 2]} rounded-xl px-4 py-3 grid gap-4`}
        style={{ gridTemplateColumns: `repeat(${cells}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: cells }).map((__, cellIdx) => (
          <SkeletonText
            key={cellIdx}
            size="md"
            width={cellWidth(cellIdx, cells)}
          />
        ))}
      </div>
    ))}
  </div>
);
