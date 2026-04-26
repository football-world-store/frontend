export type StockMovementType = "ENTRY" | "REVERSE";

export interface StockEntry {
  id: string;
  productId: string;
  productName: string;
  type: StockMovementType;
  quantity: number;
  unitCost: number;
  registeredAt: string;
  registeredBy: string;
}
