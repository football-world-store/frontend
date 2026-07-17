"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button, Spinner } from "@/components/atoms";
import { FormField } from "@/components/molecules";
import { useRequestMagicLinkMutation } from "@/hooks/mutations";
import {
  requestMagicLinkSchema,
  type RequestMagicLinkFormValues,
} from "@/lib/validations";

export const RequestMagicLinkForm = () => {
  const mutation = useRequestMagicLinkMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestMagicLinkFormValues>({
    resolver: zodResolver(requestMagicLinkSchema),
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
          "Enviar link de acesso"
        )}
      </Button>
    </form>
  );
};
