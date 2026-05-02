"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button, Spinner } from "@/components/atoms";
import { FormField, PasswordField, SelectField } from "@/components/molecules";
import { useCreateUserMutation } from "@/hooks/mutations";
import {
  USER_ROLE_OPTIONS,
  userSchema,
  type UserFormValues,
} from "@/lib/validations";

interface UserFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const UserForm = ({ onSuccess, onCancel }: UserFormProps) => {
  const mutation = useCreateUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", email: "", password: "", role: "EMPLOYEE" },
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
        placeholder="Nome completo"
        error={errors.name?.message}
        {...register("name")}
      />
      <FormField
        label="Email"
        type="email"
        placeholder="email@footballworld.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <PasswordField
        label="Senha provisória"
        autoComplete="new-password"
        placeholder="Mínimo 8 caracteres"
        error={errors.password?.message}
        {...register("password")}
      />
      <SelectField
        label="Perfil"
        options={USER_ROLE_OPTIONS}
        error={errors.role?.message}
        {...register("role")}
      />
      <p className="font-label text-xs text-on-surface-variant">
        O usuário poderá trocar a senha após o primeiro acesso.
      </p>
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
              Criando...
            </>
          ) : (
            "Criar usuário"
          )}
        </Button>
      </div>
    </form>
  );
};
