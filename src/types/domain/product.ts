export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceInCents: number;
  imageUrl: string;
  inStock: boolean;
}
