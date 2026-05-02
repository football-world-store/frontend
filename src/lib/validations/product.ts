import { z } from "zod";

import { PRODUCT_CATEGORIES } from "@/types";

import { nameField } from "./shared";

export const productSchema = z.object({
  name: nameField,
  clubOrBrand: z.string().min(1, "Clube/marca obrigatório"),
  category: z.enum(PRODUCT_CATEGORIES, { error: "Selecione uma categoria" }),
  size: z.string().min(1, "Tamanho obrigatório"),
  costPrice: z.coerce.number().nonnegative("Custo inválido"),
  salePrice: z.coerce.number().positive("Preço de venda inválido"),
  initialQuantity: z.coerce.number().int().nonnegative("Quantidade inválida"),
  minStock: z.coerce.number().int().nonnegative("Mínimo inválido"),
});

export type ProductFormInput = z.input<typeof productSchema>;
export type ProductFormValues = z.output<typeof productSchema>;

export const PRODUCT_CATEGORY_OPTIONS = PRODUCT_CATEGORIES.map((value) => ({
  value,
  label: value.charAt(0) + value.slice(1).toLowerCase(),
}));
