import type { ListQueryParams } from "@/types/api/common";

export type CustomerStatus = "ACTIVE" | "COOLING" | "INACTIVE";

export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  status: CustomerStatus;
  favoriteTeam: string | null;
  preferredSizes: string[];
  birthDate: string | null;
  notes: string | null;
  totalSpent: number;
  totalOrders: number;
  lastPurchaseAt: string | null;
  createdAt: string;
}

export interface CreateCustomerBody {
  name: string;
  whatsapp: string;
  email?: string;
  favoriteTeam?: string;
  preferredSizes?: string[];
  birthDate?: string;
  notes?: string;
}

export interface UpdateCustomerBody {
  id: string;
  name?: string;
  whatsapp?: string;
  email?: string;
  favoriteTeam?: string;
  preferredSizes?: string[];
  birthDate?: string;
  notes?: string;
}

export interface ListCustomersParams extends ListQueryParams {
  search?: string;
  favoriteTeam?: string;
  preferredSizes?: string;
  status?: CustomerStatus;
  minSpent?: number;
  maxSpent?: number;
}

export interface CustomerPurchase {
  id: string;
  totalAmount: number;
  createdAt: string;
}

export interface CustomerPurchasesResult {
  items: CustomerPurchase[];
  page: number;
  limit: number;
  total: number;
  totalSpent: number;
  averageTicket: number;
  lastPurchaseAt: string | null;
}

export interface CustomerRankingEntry {
  id: string;
  name: string;
  totalSpent: number;
  purchaseCount: number;
}
