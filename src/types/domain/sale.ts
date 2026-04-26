export type SaleChannel = "LOJA_FISICA" | "INSTAGRAM" | "WHATSAPP";
export type PaymentMethod = "DINHEIRO" | "PIX" | "DEBITO" | "CREDITO";
export type SaleStatus = "CONFIRMED" | "CANCELLED";

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Sale {
  id: string;
  channel: SaleChannel;
  paymentMethod: PaymentMethod;
  status: SaleStatus;
  customerId: string | null;
  customerName: string | null;
  totalAmount: number;
  soldAt: string;
  soldBy: string;
  items: SaleItem[];
}
