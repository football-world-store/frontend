import { z } from "zod";

import { VALIDATION_MESSAGES, nameField } from "./shared";

export const customerSchema = z.object({
  name: nameField,
  phone: z
    .string()
    .min(8, "Telefone inválido")
    .or(z.literal("").transform(() => null))
    .nullable()
    .optional(),
  email: z
    .string()
    .email(VALIDATION_MESSAGES.emailInvalid)
    .or(z.literal("").transform(() => null))
    .nullable()
    .optional(),
  notes: z.string().optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
