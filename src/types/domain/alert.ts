export type AlertType = "STOCK_LOW" | "STOCK_OUT" | "PRODUCT_IDLE";
export type AlertSeverity = "CRITICAL" | "INFORMATIONAL";

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  productId: string | null;
  productName: string | null;
  message: string;
  createdAt: string;
  acknowledgedAt: string | null;
}
