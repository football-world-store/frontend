import { z } from "zod";

const PASSWORD_MIN_LENGTH = 8;

const VALIDATION_MESSAGES = {
  emailInvalid: "Email inválido",
  passwordMin: `Senha deve ter ao menos ${PASSWORD_MIN_LENGTH} caracteres`,
  passwordConfirm: "Confirme a senha",
  passwordsMismatch: "Senhas não conferem",
  codeRequired: "Código é obrigatório",
} as const;

const emailField = z.string().email(VALIDATION_MESSAGES.emailInvalid);
const passwordField = z
  .string()
  .min(PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES.passwordMin);

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const resetPasswordSchema = z
  .object({
    email: emailField,
    code: z.string().min(1, VALIDATION_MESSAGES.codeRequired),
    newPassword: passwordField,
    confirmPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES.passwordConfirm),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: VALIDATION_MESSAGES.passwordsMismatch,
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
