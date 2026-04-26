export type ProductCategory =
  | "CAMISA"
  | "SHORT"
  | "MEIAO"
  | "AGASALHO"
  | "ACESSORIO"
  | "CALCADO";

export interface Product {
  id: string;
  internalCode: string;
  name: string;
  clubOrBrand: string;
  category: ProductCategory;
  size: string;
  photoUrl: string | null;
  costPrice: number;
  salePrice: number;
  quantity: number;
  minStock: number;
  isActive: boolean;
  lastSaleAt: string | null;
  totalSold: number;
}
