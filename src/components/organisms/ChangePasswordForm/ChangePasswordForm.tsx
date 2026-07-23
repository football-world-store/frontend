"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button, Spinner } from "@/components/atoms";
import { PasswordField } from "@/components/molecules";
import { useChangePasswordMutation } from "@/hooks/mutations";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/lib/validations";

interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ChangePasswordForm = ({
  onSuccess,
  onCancel,
}: ChangePasswordFormProps) => {
  const mutation = useChangePasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async ({ currentPassword, newPassword }) => {
    await mutation.mutateAsync({ currentPassword, newPassword });
    onSuccess?.();
  });

  const isPending = mutation.isPending || isSubmitting;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <PasswordField
        label="Senha atual"
        autoComplete="current-password"
        placeholder="Digite a senha atual"
        error={errors.currentPassword?.message}
        {...register("currentPassword")}
      />
      <PasswordField
        label="Nova senha"
        autoComplete="new-password"
        placeholder="Digite a nova senha"
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />
      <PasswordField
        label="Confirmar nova senha"
        autoComplete="new-password"
        placeholder="Confirme a nova senha"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        {onCancel ? (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isPending}
          >
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
            "Trocar senha"
          )}
        </Button>
      </div>
    </form>
  );
};
