export type CustomerStatus = "ACTIVE" | "COOLING" | "INACTIVE";

export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  status: CustomerStatus;
  totalSpent: number;
  totalOrders: number;
  lastPurchaseAt: string | null;
  createdAt: string;
}
