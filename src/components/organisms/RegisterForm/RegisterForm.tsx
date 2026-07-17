"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button, Spinner } from "@/components/atoms";
import { FormField, PasswordField } from "@/components/molecules";
import { APP_ROUTES } from "@/constants";
import { useRegisterUserMutation } from "@/hooks/mutations";
import {
  registerUserSchema,
  type RegisterUserFormValues,
} from "@/lib/validations";

export const RegisterForm = () => {
  const mutation = useRegisterUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterUserFormValues>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit((values) =>
    mutation.mutate({
      name: values.name,
      email: values.email,
      password: values.password,
    }),
  );

  const isPending = mutation.isPending || isSubmitting;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <FormField
        label="Nome"
        autoComplete="name"
        placeholder="Seu nome completo"
        error={errors.name?.message}
        {...register("name")}
      />
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
        autoComplete="new-password"
        placeholder="Crie uma senha"
        error={errors.password?.message}
        {...register("password")}
      />
      <PasswordField
        label="Confirmar senha"
        autoComplete="new-password"
        placeholder="Repita a senha"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? (
          <>
            <Spinner size="sm" tone="on-primary" />
            Enviando...
          </>
        ) : (
          "Solicitar cadastro"
        )}
      </Button>
      <p className="text-center font-label text-xs uppercase tracking-wider text-on-surface-variant">
        Já tem uma conta?{" "}
        <Link
          href={APP_ROUTES.auth.signIn}
          className="text-primary hover:opacity-80 transition-opacity"
        >
          Fazer login
        </Link>
      </p>
    </form>
  );
};
