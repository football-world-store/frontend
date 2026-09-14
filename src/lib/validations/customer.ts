import { z } from "zod";

import { VALIDATION_MESSAGES, nameField } from "./shared";

export const customerSchema = z.object({
  name: nameField,
  phone: z
    .string()
    .refine(
      (value) => /^\d{10,15}$/.test(value.replace(/\D/g, "")),
      "Informe DDD + número (10 a 15 dígitos, só números)",
    ),
  email: z
    .string()
    .email(VALIDATION_MESSAGES.emailInvalid)
    .or(z.literal("").transform(() => null))
    .nullable()
    .optional(),
  notes: z.string().optional(),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
