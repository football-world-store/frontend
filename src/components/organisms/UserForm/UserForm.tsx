"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, Spinner } from "@/components/atoms";
import { FormField, PasswordField, SelectField } from "@/components/molecules";
import {
  useAdminResetPasswordMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
} from "@/hooks/mutations";
import {
  USER_ROLE_OPTIONS,
  userSchema,
  type UserFormValues,
} from "@/lib/validations";
import type { SystemUser } from "@/types";

interface UserFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  user?: SystemUser;
}

const editUserSchema = userSchema.omit({ password: true });
type EditUserFormValues = z.infer<typeof editUserSchema>;

const CreateUserFields = ({
  register,
  errors,
}: {
  register: ReturnType<typeof useForm<UserFormValues>>["register"];
  errors: ReturnType<typeof useForm<UserFormValues>>["formState"]["errors"];
}) => (
  <>
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
  </>
);

const EditUserFields = ({
  register,
  errors,
}: {
  register: ReturnType<typeof useForm<EditUserFormValues>>["register"];
  errors: ReturnType<typeof useForm<EditUserFormValues>>["formState"]["errors"];
}) => (
  <>
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
    <SelectField
      label="Perfil"
      options={USER_ROLE_OPTIONS}
      error={errors.role?.message}
      {...register("role")}
    />
  </>
);

const CreateUserForm = ({ onSuccess, onCancel }: UserFormProps) => {
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
      <CreateUserFields register={register} errors={errors} />
      <p className="font-label text-xs text-on-surface-variant">
        O usuário poderá trocar a senha após o primeiro acesso.
      </p>
      <FormFooter
        onCancel={onCancel}
        isPending={isPending}
        submitLabel="Criar usuário"
        pendingLabel="Criando..."
      />
    </form>
  );
};

const EditUserForm = ({
  onSuccess,
  onCancel,
  user,
}: UserFormProps & { user: SystemUser }) => {
  const mutation = useUpdateUserMutation();
  const resetPasswordMutation = useAdminResetPasswordMutation();
  const [newPassword, setNewPassword] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await mutation.mutateAsync({ id: user.id, ...values });
    if (newPassword) {
      await resetPasswordMutation.mutateAsync({ id: user.id, newPassword });
    }
    onSuccess?.();
  });

  const isPending =
    mutation.isPending || resetPasswordMutation.isPending || isSubmitting;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <EditUserFields register={register} errors={errors} />
      <div>
        <p className="font-label text-xs text-on-surface-variant mb-2">
          Nova senha (deixe em branco para não alterar)
        </p>
        <PasswordField
          label="Nova senha"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres, maiúscula, minúscula e número"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <FormFooter
        onCancel={onCancel}
        isPending={isPending}
        submitLabel="Salvar alterações"
        pendingLabel="Salvando..."
      />
    </form>
  );
};

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

export const UserForm = ({ onSuccess, onCancel, user }: UserFormProps) => {
  if (user) {
    return (
      <EditUserForm user={user} onSuccess={onSuccess} onCancel={onCancel} />
    );
  }
  return <CreateUserForm onSuccess={onSuccess} onCancel={onCancel} />;
};
