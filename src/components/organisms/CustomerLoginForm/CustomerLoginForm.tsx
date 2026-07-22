"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button, Spinner } from "@/components/atoms";
import { FormField } from "@/components/molecules";
import { ERROR_MESSAGES } from "@/constants";
import { useCustomerLoginMutation } from "@/hooks/mutations";
import {
  customerLoginSchema,
  type CustomerLoginFormValues,
} from "@/lib/validations";

const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  ACCOUNT_PENDING_APPROVAL:
    ERROR_MESSAGES.ACCOUNT_PENDING_APPROVAL ??
    "Seu cadastro ainda não foi aprovado. Aguarde a liberação de um administrador.",
};

export const CustomerLoginForm = () => {
  const mutation = useCustomerLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerLoginFormValues>({
    resolver: zodResolver(customerLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (!mutation.error) return;
    const msg =
      LOGIN_ERROR_MESSAGES[mutation.error.message] ??
      "E-mail ou senha incorretos.";
    toast.error(msg);
  }, [mutation.error]);

  const onSubmit = handleSubmit((values) => mutation.mutate(values));
  const isPending = mutation.isPending || isSubmitting;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <FormField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="seu@email.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <FormField
        label="Senha"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />
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
