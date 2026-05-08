export type AlertType = "STOCK_LOW" | "STOCK_OUT" | "PRODUCT_IDLE";
export type AlertSeverity = "CRITICAL" | "INFORMATIONAL";

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  productId: string | null;
  productName: string | null;
  message: string;
  isResolved: boolean;
  resolvedAt: string | null;
  createdAt: string;
}

export interface AlertCount {
  total: number;
  critical: number;
  informational: number;
}

export interface ResolveAlertBody {
  id: string;
  note?: string;
}
