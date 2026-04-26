interface ClubProgressItem {
  name: string;
  units: number;
  percentage: number;
}

interface ClubProgressListProps {
  items: ClubProgressItem[];
}

export const ClubProgressList = ({ items }: ClubProgressListProps) => {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.name}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-body text-sm text-on-surface">
              {item.name}
            </span>
            <span className="font-label text-xs text-on-surface-variant">
              {item.units} unidades
            </span>
          </div>
          <div className="h-2 bg-surface-container-low rounded-pill overflow-hidden">
            <div
              className="h-full bg-metallic rounded-pill"
              style={{ width: `${Math.min(100, item.percentage)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};
