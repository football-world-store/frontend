"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button, Spinner } from "@/components/atoms";
import { FormField, PasswordField } from "@/components/molecules";
import { useResetPasswordMutation } from "@/hooks/mutations";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validations";

export const ResetPasswordForm = () => {
  const mutation = useResetPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(({ email, code, newPassword }) =>
    mutation.mutate({ token: `${email}:${code}`, newPassword }),
  );

  const isPending = mutation.isPending || isSubmitting;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <FormField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="seu@email.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <FormField
        label="Código de verificação"
        type="text"
        autoComplete="one-time-code"
        placeholder="Código enviado por email"
        error={errors.code?.message}
        {...register("code")}
      />
      <PasswordField
        label="Nova senha"
        autoComplete="new-password"
        placeholder="Digite a nova senha"
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />
      <PasswordField
        label="Confirmar senha"
        autoComplete="new-password"
        placeholder="Confirme a nova senha"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? (
          <>
            <Spinner size="sm" tone="on-primary" />
            Salvando...
          </>
        ) : (
          "Redefinir senha"
        )}
      </Button>
    </form>
  );
};
