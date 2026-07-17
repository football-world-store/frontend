import type { ListQueryParams } from "@/types/api/common";

export interface StockEntryProduct {
  id: string;
  internalCode: string;
  name: string;
}

export interface StockEntryUser {
  id: string;
  name: string;
}

/**
 * Shape confirmado contra
 * backend/src/modules/stock-entries/domain/types/stock-entry.types.ts
 * (StockEntryResponse). unitCost/totalCost ficam ausentes (não `null`) na
 * resposta quando o usuário logado é EMPLOYEE — trate como opcionais, não
 * nullable.
 */
export interface StockEntry {
  id: string;
  product: StockEntryProduct;
  quantity: number;
  unitCost?: number;
  totalCost?: number;
  supplier: string;
  notes: string | null;
  isReverse: boolean;
  reverseOf: string | null;
  user: StockEntryUser;
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
