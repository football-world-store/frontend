"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button, Spinner } from "@/components/atoms";
import { FormField, PasswordField } from "@/components/molecules";
import { APP_ROUTES } from "@/constants";
import { useLoginMutation } from "@/hooks/mutations";
import { loginSchema, type LoginFormValues } from "@/lib/validations";

export const LoginForm = () => {
  const loginMutation = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => loginMutation.mutate(values));

  const isPending = loginMutation.isPending || isSubmitting;

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
      <PasswordField
        label="Senha"
        autoComplete="current-password"
        placeholder="Digite sua senha"
        error={errors.password?.message}
        {...register("password")}
      />
      <div className="flex justify-end -mt-2">
        <Link
          href={APP_ROUTES.auth.forgotPassword}
          className="font-label text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
        >
          Esqueci minha senha
        </Link>
      </div>
      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? (
          <>
            <Spinner size="sm" tone="on-primary" />
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </Button>
    </form>
  );
};
