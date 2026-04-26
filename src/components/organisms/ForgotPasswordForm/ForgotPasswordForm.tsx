"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button, Spinner } from "@/components/atoms";
import { FormField } from "@/components/molecules";
import { APP_ROUTES } from "@/constants";
import { useForgotPasswordMutation } from "@/hooks/mutations";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validations";

export const ForgotPasswordForm = () => {
  const mutation = useForgotPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));
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
      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? (
          <>
            <Spinner size="sm" tone="on-primary" />
            Enviando...
          </>
        ) : (
          "Enviar instruções"
        )}
      </Button>
      <p className="text-center font-label text-xs uppercase tracking-wider text-on-surface-variant">
        Lembrou da senha?{" "}
        <Link
          href={APP_ROUTES.auth.signIn}
          className="text-primary hover:opacity-80 transition-opacity"
        >
          Voltar ao login
        </Link>
      </p>
    </form>
  );
};
