import { Badge, IconButton, OwnerOnly } from "@/components/atoms";
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
  <div className={`px-4 py-3 space-y-2 ${zebraRowTier(index)}`}>
    <div className="flex items-start justify-between gap-2">
      <span className="min-w-0 flex-1 font-body text-sm font-semibold text-on-surface truncate">
        {entry.product.name}
      </span>
      <div className="flex flex-shrink-0 items-center gap-2">
        <Badge tone={entry.isReverse ? "warning" : "success"}>
          {entry.isReverse ? "Estorno" : "Entrada"}
        </Badge>
        {entry.isReverse ? null : (
          <OwnerOnly>
            <IconButton
              iconName="undo"
              label={`Estornar ${entry.product.name}`}
              filled={false}
              onClick={() => onReverse(entry.id)}
            />
          </OwnerOnly>
        )}
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-2 font-label text-xs text-on-surface-variant">
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
        <OwnerOnly>
          <IconButton
            iconName="undo"
            label={`Estornar ${entry.product.name}`}
            filled={false}
            onClick={() => onReverse(entry.id)}
          />
        </OwnerOnly>
      )}
    </span>
  </div>
);
