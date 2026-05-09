import type { ListQueryParams } from "@/types/api/common";

export const PRODUCT_CATEGORIES = [
  "CAMISA",
  "SHORT",
  "MEIAO",
  "AGASALHO",
  "ACESSORIO",
  "CALCADO",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export type ProductStatus = "IN_STOCK" | "CRITICAL" | "OUT_OF_STOCK" | "IDLE";

export interface Product {
  id: string;
  internalCode: string;
  name: string;
  clubOrBrand: string;
  category: ProductCategory;
  size: string;
  photoUrl: string | null;
  costPrice: number | null;
  salePrice: number;
  quantity: number;
  minStock: number;
  isActive: boolean;
  lastSaleAt: string | null;
  totalSold: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ListProductsParams extends ListQueryParams {
  search?: string;
  clubOrBrand?: string;
  category?: ProductCategory;
  size?: string;
  status?: ProductStatus;
  includeInactive?: boolean;
}

export interface CreateProductBody {
  name: string;
  clubOrBrand: string;
  category: ProductCategory;
  size: string;
  photoUrl?: string;
  costPrice: number;
  salePrice: number;
  initialQuantity: number;
  minStock: number;
}

export interface UpdateProductBody {
  id: string;
  name?: string;
  clubOrBrand?: string;
  category?: ProductCategory;
  size?: string;
  photoUrl?: string;
  costPrice?: number;
  salePrice?: number;
  minStock?: number;
}
