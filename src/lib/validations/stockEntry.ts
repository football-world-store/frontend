import { z } from "zod";

export const stockEntrySchema = z.object({
  productId: z.string().min(1, "Selecione um produto"),
  quantity: z.coerce.number().int().positive("Quantidade deve ser positiva"),
  unitCost: z.coerce.number().nonnegative("Custo inválido"),
  supplier: z.string().min(1, "Fornecedor obrigatório"),
  notes: z.string().optional(),
});

export type StockEntryFormInput = z.input<typeof stockEntrySchema>;
export type StockEntryFormValues = z.output<typeof stockEntrySchema>;
