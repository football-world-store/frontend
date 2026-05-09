import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 8;

export const VALIDATION_MESSAGES = {
  emailInvalid: "Email inválido",
  nameRequired: "Nome obrigatório",
  passwordMin: `Senha deve ter ao menos ${PASSWORD_MIN_LENGTH} caracteres`,
  passwordConfirm: "Confirme a senha",
  passwordsMismatch: "Senhas não conferem",
  tokenRequired: "Token é obrigatório",
} as const;

export const emailField = z.string().email(VALIDATION_MESSAGES.emailInvalid);

export const passwordField = z
  .string()
  .min(PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES.passwordMin);

export const nameField = z.string().min(2, VALIDATION_MESSAGES.nameRequired);
