import { z } from "zod";

import { emailField, nameField, strongPasswordField } from "./shared";

export const requestMagicLinkSchema = z.object({
  email: emailField,
});

export type RequestMagicLinkFormValues = z.infer<typeof requestMagicLinkSchema>;

export const customerLoginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Senha obrigatória"),
});

export type CustomerLoginFormValues = z.infer<typeof customerLoginSchema>;

export const registerCustomerSchema = z.object({
  name: nameField,
  email: emailField,
  password: strongPasswordField,
  whatsapp: z
    .string()
    .regex(
      /^\d{10,11}$/,
      "Informe DDD + número (10 ou 11 dígitos, só números)",
    ),
  birthDate: z.string().optional(),
});

export type RegisterCustomerFormValues = z.infer<typeof registerCustomerSchema>;
