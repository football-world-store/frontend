import type { ListQueryParams } from "@/types/api/common";

export type StockMovementType = "ENTRY" | "REVERSE";

export interface StockEntry {
  id: string;
  productId: string;
  productName: string;
  movementType: StockMovementType;
  quantity: number;
  unitCost: number | null;
  supplier: string;
  notes: string | null;
  reversedEntryId: string | null;
  userId: string;
  userName: string;
  entryDate: string;
  createdAt: string;
}

export interface CreateStockEntryBody {
  productId: string;
  quantity: number;
  unitCost: number;
  supplier: string;
  notes?: string;
}

export interface ReverseStockEntryBody {
  id: string;
  reason: string;
}

export interface ListStockEntriesParams extends ListQueryParams {
  productId?: string;
  userId?: string;
  supplier?: string;
  startDate?: string;
  endDate?: string;
}
