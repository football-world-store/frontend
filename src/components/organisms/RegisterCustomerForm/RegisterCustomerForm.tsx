"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button, Spinner } from "@/components/atoms";
import { FormField } from "@/components/molecules";
import { useRegisterCustomerMutation } from "@/hooks/mutations";
import {
  registerCustomerSchema,
  type RegisterCustomerFormValues,
} from "@/lib/validations";

export const RegisterCustomerForm = () => {
  const mutation = useRegisterCustomerMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterCustomerFormValues>({
    resolver: zodResolver(registerCustomerSchema),
    defaultValues: { name: "", email: "", password: "", whatsapp: "" },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));
  const isPending = mutation.isPending || isSubmitting;

  if (mutation.isSuccess) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center">
          <span className="text-3xl">⏳</span>
        </div>
        <div>
          <p className="font-headline text-lg font-bold text-on-surface">
            Cadastro realizado!
          </p>
          <p className="font-body text-sm text-on-surface-variant mt-1">
            Seu cadastro foi enviado para análise. Assim que um administrador
            aprovar seu acesso, você poderá entrar normalmente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <FormField
        label="Nome"
        type="text"
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
      <FormField
        label="WhatsApp"
        type="tel"
        autoComplete="tel"
        placeholder="11999999999 (DDD + número)"
        error={errors.whatsapp?.message}
        {...register("whatsapp")}
      />
      <FormField
        label="Senha"
        type="password"
        autoComplete="new-password"
        placeholder="Mínimo 8 caracteres"
        error={errors.password?.message}
        {...register("password")}
      />
      {mutation.isError && (
        <p className="font-body text-error text-sm">
          {(mutation.error as Error)?.message?.includes(
            "EMAIL_ALREADY_REGISTERED",
          )
            ? "Este email já está cadastrado."
            : "Erro ao criar conta. Tente novamente."}
        </p>
      )}
      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? (
          <>
            <Spinner size="sm" tone="on-primary" />
            Criando conta...
          </>
        ) : (
          "Criar conta"
        )}
      </Button>
    </form>
  );
};
