import { z } from "zod";

import { emailField, nameField, passwordField } from "./shared";

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
  password: passwordField,
});

export type RegisterCustomerFormValues = z.infer<typeof registerCustomerSchema>;
