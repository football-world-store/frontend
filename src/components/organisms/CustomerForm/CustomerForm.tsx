"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button, Spinner } from "@/components/atoms";
import { FormField } from "@/components/molecules";
import {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
} from "@/hooks/mutations";
import { customerSchema, type CustomerFormValues } from "@/lib/validations";
import type { Customer } from "@/types";

interface CustomerFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  customer?: Customer;
}

const CustomerFields = ({
  register,
  errors,
}: {
  register: ReturnType<typeof useForm<CustomerFormValues>>["register"];
  errors: ReturnType<typeof useForm<CustomerFormValues>>["formState"]["errors"];
}) => (
  <>
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
  </>
);

interface FormFooterProps {
  onCancel?: () => void;
  isPending: boolean;
  submitLabel: string;
  pendingLabel: string;
}

const FormFooter = ({
  onCancel,
  isPending,
  submitLabel,
  pendingLabel,
}: FormFooterProps) => (
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
          {pendingLabel}
        </>
      ) : (
        submitLabel
      )}
    </Button>
  </div>
);

const CreateCustomerForm = ({ onSuccess, onCancel }: CustomerFormProps) => {
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
    try {
      await mutation.mutateAsync({
        name: values.name,
        whatsapp: values.phone.replace(/\D/g, ""),
        email: values.email ?? undefined,
        notes: values.notes,
      });
      onSuccess?.();
    } catch {
      // Erro já é exibido via toast pelo interceptor do axios.
    }
  });

  const isPending = mutation.isPending || isSubmitting;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <CustomerFields register={register} errors={errors} />
      <FormFooter
        onCancel={onCancel}
        isPending={isPending}
        submitLabel="Cadastrar cliente"
        pendingLabel="Salvando..."
      />
    </form>
  );
};

const EditCustomerForm = ({
  onSuccess,
  onCancel,
  customer,
}: CustomerFormProps & { customer: Customer }) => {
  const mutation = useUpdateCustomerMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer.name,
      phone: customer.phone ?? "",
      email: customer.email ?? "",
      notes: customer.notes ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({
        id: customer.id,
        name: values.name,
        whatsapp: values.phone.replace(/\D/g, ""),
        email: values.email ?? undefined,
        notes: values.notes,
      });
      onSuccess?.();
    } catch {
      // Erro já é exibido via toast pelo interceptor do axios.
    }
  });

  const isPending = mutation.isPending || isSubmitting;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <CustomerFields register={register} errors={errors} />
      <FormFooter
        onCancel={onCancel}
        isPending={isPending}
        submitLabel="Salvar alterações"
        pendingLabel="Salvando..."
      />
    </form>
  );
};

export const CustomerForm = ({
  onSuccess,
  onCancel,
  customer,
}: CustomerFormProps) => {
  if (customer) {
    return (
      <EditCustomerForm
        customer={customer}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    );
  }
  return <CreateCustomerForm onSuccess={onSuccess} onCancel={onCancel} />;
};
