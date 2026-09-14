import { z } from "zod";

import {
  emailField,
  nameField,
  strongPasswordField,
  VALIDATION_MESSAGES,
} from "./shared";

const whatsappField = z
  .string()
  .regex(/^\d{10,11}$/, "Informe DDD + número (10 ou 11 dígitos, só números)");

export const registerCustomerSchema = z.object({
  name: nameField,
  email: emailField,
  password: strongPasswordField,
  whatsapp: whatsappField,
  birthDate: z.string().optional(),
});

export type RegisterCustomerFormValues = z.infer<typeof registerCustomerSchema>;

export const updateCustomerProfileSchema = z.object({
  name: nameField,
  whatsapp: z
    .string()
    .refine(
      (value) => /^\d{10,11}$/.test(value.replace(/\D/g, "")),
      "Informe DDD + número (10 ou 11 dígitos, só números)",
    ),
});

export type UpdateCustomerProfileFormValues = z.infer<
  typeof updateCustomerProfileSchema
>;

export const changeCustomerPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Informe a senha atual"),
    newPassword: strongPasswordField,
    confirmPassword: z.string().min(1, VALIDATION_MESSAGES.passwordConfirm),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: VALIDATION_MESSAGES.passwordsMismatch,
    path: ["confirmPassword"],
  });

export type ChangeCustomerPasswordFormValues = z.infer<
  typeof changeCustomerPasswordSchema
>;
