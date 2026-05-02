import type { ListQueryParams } from "@/types/api/common";

export type SaleChannel = "LOJA_FISICA" | "INSTAGRAM" | "WHATSAPP" | "SITE";
export type PaymentMethod = "DINHEIRO" | "PIX" | "DEBITO" | "CREDITO";
export type SaleStatus = "CONFIRMED" | "CANCELLED";

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  saleNumber: number;
  channel: SaleChannel;
  paymentMethod: PaymentMethod;
  status: SaleStatus;
  customerId: string | null;
  customerName: string | null;
  discount: number;
  totalAmount: number;
  saleDate: string;
  createdAt: string;
  cancelledAt: string | null;
  cancelReason: string | null;
  userId: string;
  items: SaleItem[];
}

export interface CreateSaleItemBody {
  productId: string;
  quantity: number;
  unitPrice?: number;
}

export interface CreateSaleBody {
  items: CreateSaleItemBody[];
  channel: SaleChannel;
  paymentMethod: PaymentMethod;
  customerId?: string;
  discount?: number;
  saleDate?: string;
}

export interface CancelSaleBody {
  id: string;
  cancelReason?: string;
}

export interface ListSalesParams extends ListQueryParams {
  productId?: string;
  customerId?: string;
  userId?: string;
  channel?: SaleChannel;
  status?: SaleStatus;
  startDate?: string;
  endDate?: string;
}
