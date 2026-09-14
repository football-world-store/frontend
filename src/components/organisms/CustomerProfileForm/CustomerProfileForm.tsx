"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";

import { Avatar, Button, Icon, Spinner } from "@/components/atoms";
import { FormField, PasswordField } from "@/components/molecules";
import {
  useChangeCustomerPasswordMutation,
  useUpdateCustomerProfileMutation,
  useUploadCustomerAvatarMutation,
} from "@/hooks/mutations";
import {
  changeCustomerPasswordSchema,
  updateCustomerProfileSchema,
  type ChangeCustomerPasswordFormValues,
  type UpdateCustomerProfileFormValues,
} from "@/lib/validations";
import type { CustomerProfile } from "@/types";
import { formatPhoneInput } from "@/utils";

const CustomerAvatarSection = ({ profile }: { profile: CustomerProfile }) => {
  const mutation = useUploadCustomerAvatarMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    mutation.mutate(file, {
      onSettled: () => {
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar
        name={profile.name}
        src={profile.photoUrl}
        className="h-16 w-16 text-lg"
      />
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Selecionar foto de perfil"
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <Spinner size="sm" />
              Enviando...
            </>
          ) : (
            <>
              <Icon name="upload" size="sm" />
              Trocar foto
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

interface CustomerProfileDataFormProps {
  profile: CustomerProfile;
}

const CustomerProfileDataForm = ({ profile }: CustomerProfileDataFormProps) => {
  const mutation = useUpdateCustomerProfileMutation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateCustomerProfileFormValues>({
    resolver: zodResolver(updateCustomerProfileSchema),
    defaultValues: {
      name: profile.name,
      whatsapp: formatPhoneInput(profile.whatsapp),
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({
        name: values.name,
        whatsapp: values.whatsapp.replace(/\D/g, ""),
      });
    } catch {
      // Erro já é exibido via toast pelo interceptor do axios.
    }
  });

  const isPending = mutation.isPending || isSubmitting;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <FormField
        label="Nome"
        placeholder="Seu nome completo"
        error={errors.name?.message}
        {...register("name")}
      />
      <FormField
        label="Email"
        type="email"
        value={profile.email ?? ""}
        disabled
        readOnly
        hint="O email não pode ser alterado por aqui."
      />
      <FormField
        label="WhatsApp"
        type="tel"
        placeholder="(11) 99999-9999"
        error={errors.whatsapp?.message}
        {...register("whatsapp", {
          onChange: (event) => {
            setValue("whatsapp", formatPhoneInput(event.target.value), {
              shouldValidate: true,
            });
          },
        })}
      />
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner size="sm" tone="on-primary" />
              Salvando...
            </>
          ) : (
            "Salvar dados"
          )}
        </Button>
      </div>
    </form>
  );
};

const CustomerPasswordForm = () => {
  const mutation = useChangeCustomerPasswordMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangeCustomerPasswordFormValues>({
    resolver: zodResolver(changeCustomerPasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values);
      reset();
    } catch {
      // Erro já é exibido via toast pelo interceptor do axios.
    }
  });

  const isPending = mutation.isPending || isSubmitting;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
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
      <div className="flex justify-end pt-2">
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

interface CustomerProfileFormProps {
  profile: CustomerProfile;
}

export const CustomerProfileForm = ({ profile }: CustomerProfileFormProps) => (
  <div className="flex flex-col gap-8">
    <section className="rounded-2xl bg-surface-container-low p-6">
      <h2 className="mb-5 font-headline text-lg font-bold">Foto de perfil</h2>
      <CustomerAvatarSection profile={profile} />
    </section>
    <section className="rounded-2xl bg-surface-container-low p-6">
      <h2 className="mb-5 font-headline text-lg font-bold">Dados pessoais</h2>
      <CustomerProfileDataForm profile={profile} />
    </section>
    <section className="rounded-2xl bg-surface-container-low p-6">
      <h2 className="mb-5 font-headline text-lg font-bold">Alterar senha</h2>
      <CustomerPasswordForm />
    </section>
  </div>
);
