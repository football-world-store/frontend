import { z } from "zod";

export const stockEntrySchema = z.object({
  productId: z.string().min(1, "Selecione um produto"),
  type: z.enum(["ENTRY", "REVERSE"], { error: "Selecione o tipo" }),
  quantity: z.coerce.number().int().positive("Quantidade deve ser positiva"),
  unitCost: z.coerce.number().nonnegative("Custo inválido"),
  supplier: z.string().optional(),
  registeredAt: z.string().min(1, "Data obrigatória"),
});

export type StockEntryFormInput = z.input<typeof stockEntrySchema>;
export type StockEntryFormValues = z.output<typeof stockEntrySchema>;
