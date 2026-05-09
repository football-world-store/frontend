"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button, Spinner } from "@/components/atoms";
import { FormField, PasswordField } from "@/components/molecules";
import { useResetPasswordMutation } from "@/hooks/mutations";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validations";

const TOKEN_QUERY_PARAM = "token";

export const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const tokenFromQuery = searchParams.get(TOKEN_QUERY_PARAM) ?? "";

  const mutation = useResetPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: tokenFromQuery,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  const isPending = mutation.isPending || isSubmitting;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <FormField
        label="Token de recuperação"
        type="text"
        autoComplete="one-time-code"
        placeholder="Token recebido por email"
        readOnly={Boolean(tokenFromQuery)}
        error={errors.token?.message}
        {...register("token")}
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
