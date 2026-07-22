"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button, Spinner } from "@/components/atoms";
import { FormField } from "@/components/molecules";
import { ERROR_MESSAGES } from "@/constants";
import { useCustomerLoginMutation } from "@/hooks/mutations";
import {
  customerLoginSchema,
  type CustomerLoginFormValues,
} from "@/lib/validations";

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

  const onSubmit = handleSubmit((values) => mutation.mutate(values));
  const isPending = mutation.isPending || isSubmitting;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const httpStatus = (mutation.error as any)?.response?.status;
  const loginErrorMsg =
    httpStatus === 403
      ? (ERROR_MESSAGES.ACCOUNT_PENDING_APPROVAL ??
        "Cadastro aguardando aprovação.")
      : "E-mail ou senha incorretos.";

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
      {mutation.isError && (
        <p className="font-body text-error text-sm">{loginErrorMsg}</p>
      )}
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
