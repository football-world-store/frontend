"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button, Spinner } from "@/components/atoms";
import { FormField } from "@/components/molecules";
import { useCreateCustomerMutation } from "@/hooks/mutations";
import { customerSchema, type CustomerFormValues } from "@/lib/validations";

interface CustomerFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CustomerForm = ({ onSuccess, onCancel }: CustomerFormProps) => {
  const mutation = useCreateCustomerMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: "", phone: "", email: "", notes: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    await mutation.mutateAsync(values);
    onSuccess?.();
  });

  const isPending = mutation.isPending || isSubmitting;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <FormField
        label="Nome"
        placeholder="Nome do cliente"
        error={errors.name?.message}
        {...register("name")}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField
          label="Telefone"
          type="tel"
          placeholder="+55 11 99999-0000"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <FormField
          label="Email"
          type="email"
          placeholder="cliente@email.com"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>
      <FormField
        label="Notas"
        placeholder="Observações do consultor (opcional)"
        error={errors.notes?.message}
        {...register("notes")}
      />
      <div className="flex justify-end gap-3 pt-2">
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        ) : null}
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner size="sm" tone="on-primary" />
              Salvando...
            </>
          ) : (
            "Cadastrar cliente"
          )}
        </Button>
      </div>
    </form>
  );
};
