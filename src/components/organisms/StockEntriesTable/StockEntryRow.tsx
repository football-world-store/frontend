import { Badge, IconButton } from "@/components/atoms";
import type { StockEntry } from "@/types";
import { formatDateBR, formatPriceFromReais, zebraRowTier } from "@/utils";

interface StockEntryRowProps {
  entry: StockEntry;
  index: number;
  onReverse: (id: string) => void;
}

export const StockEntryRowMobile = ({
  entry,
  index,
  onReverse,
}: StockEntryRowProps) => (
  <div className={`px-4 py-3 space-y-1 ${zebraRowTier(index)}`}>
    <div className="flex items-start justify-between gap-2">
      <span className="font-body text-sm font-semibold text-on-surface truncate">
        {entry.product.name}
      </span>
      <Badge tone={entry.isReverse ? "warning" : "success"}>
        {entry.isReverse ? "Estorno" : "Entrada"}
      </Badge>
    </div>
    <div className="flex items-center justify-between gap-2 font-label text-xs text-on-surface-variant">
      <div className="flex items-center gap-2">
        <span>{entry.quantity} un.</span>
        <span>·</span>
        <span>
          {entry.unitCost === undefined
            ? "—"
            : formatPriceFromReais(entry.unitCost)}
        </span>
        <span>·</span>
        <span>{formatDateBR(entry.createdAt)}</span>
      </div>
      {entry.isReverse ? null : (
        <IconButton
          iconName="undo"
          label={`Estornar ${entry.product.name}`}
          filled={false}
          onClick={() => onReverse(entry.id)}
        />
      )}
    </div>
  </div>
);

export const StockEntryRowDesktop = ({
  entry,
  index,
  onReverse,
}: StockEntryRowProps) => (
  <div
    className={`grid grid-cols-12 items-center px-4 py-4 gap-2 transition-colors hover:bg-surface-bright ${zebraRowTier(index)}`}
  >
    <span className="col-span-3 font-body text-sm text-on-surface">
      {entry.product.name}
    </span>
    <span className="col-span-2">
      <Badge tone={entry.isReverse ? "warning" : "success"}>
        {entry.isReverse ? "Estorno" : "Entrada"}
      </Badge>
    </span>
    <span className="col-span-2 font-body text-sm text-on-surface">
      {entry.quantity} un.
    </span>
    <span className="col-span-2 font-body text-sm text-on-surface">
      {entry.unitCost === undefined
        ? "—"
        : formatPriceFromReais(entry.unitCost)}
    </span>
    <span className="col-span-2 font-label text-xs text-on-surface-variant text-right">
      {formatDateBR(entry.createdAt)}
    </span>
    <span className="col-span-1 flex justify-end">
      {entry.isReverse ? null : (
        <IconButton
          iconName="undo"
          label={`Estornar ${entry.product.name}`}
          filled={false}
          onClick={() => onReverse(entry.id)}
        />
      )}
    </span>
  </div>
);
