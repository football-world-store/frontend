import { z } from "zod";

import {
  emailField,
  nameField,
  passwordField,
  PASSWORD_MIN_LENGTH,
  VALIDATION_MESSAGES,
} from "./shared";

const passwordConfirmField = z
  .string()
  .min(PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES.passwordConfirm);

const samePasswordsRule = {
  predicate: (data: { newPassword: string; confirmPassword: string }) =>
    data.newPassword === data.confirmPassword,
  options: {
    message: VALIDATION_MESSAGES.passwordsMismatch,
    path: ["confirmPassword"],
  },
};

const sameRegisterPasswordsRule = {
  predicate: (data: { password: string; confirmPassword: string }) =>
    data.password === data.confirmPassword,
  options: {
    message: VALIDATION_MESSAGES.passwordsMismatch,
    path: ["confirmPassword"],
  },
};

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const registerUserSchema = z
  .object({
    name: nameField,
    email: emailField,
    password: passwordField,
    confirmPassword: passwordConfirmField,
  })
  .refine(
    sameRegisterPasswordsRule.predicate,
    sameRegisterPasswordsRule.options,
  );

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, VALIDATION_MESSAGES.tokenRequired),
    newPassword: passwordField,
    confirmPassword: passwordConfirmField,
  })
  .refine(samePasswordsRule.predicate, samePasswordsRule.options);

export const changePasswordSchema = z
  .object({
    currentPassword: passwordField,
    newPassword: passwordField,
    confirmPassword: passwordConfirmField,
  })
  .refine(samePasswordsRule.predicate, samePasswordsRule.options);

export type LoginFormValues = z.infer<typeof loginSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type RegisterUserFormValues = z.infer<typeof registerUserSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
