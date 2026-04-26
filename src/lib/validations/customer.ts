import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  phone: z
    .string()
    .min(8, "Telefone inválido")
    .or(z.literal("").transform(() => null))
    .nullable()
    .optional(),
  email: z
    .string()
    .email("Email inválido")
    .or(z.literal("").transform(() => null))
    .nullable()
    .optional(),
  notes: z.string().optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
