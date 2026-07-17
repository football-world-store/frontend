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
  includeInactive?: boolean;
}

/**
 * Shape confirmado contra
 * backend/src/modules/customers/use-case/list-customer-purchases.use-case.ts —
 * GET /customers/:id/purchases devolve { data, summary, meta } SEM o
 * envelope { data: {...} } padrão dos demais endpoints (o controller
 * repassa o retorno do use-case direto).
 */
export interface CustomerPurchase {
  id: string;
  saleNumber: number;
  saleDate: string;
  channel: string;
  paymentMethod: string;
  totalAmount: number;
  status: string;
  itemCount: number;
}

export interface CustomerPurchasesSummary {
  totalSpent: number;
  purchaseCount: number;
  averageTicket: number;
  lastPurchaseAt: string | null;
}

export interface CustomerPurchasesMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CustomerPurchasesResult {
  data: CustomerPurchase[];
  summary: CustomerPurchasesSummary;
  meta: CustomerPurchasesMeta;
}

export interface CustomerRankingEntry {
  id: string;
  name: string;
  totalSpent: number;
  purchaseCount: number;
}
