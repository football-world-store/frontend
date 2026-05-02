"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button, Spinner } from "@/components/atoms";
import { FormField, SelectField } from "@/components/molecules";
import { useCreateProductMutation } from "@/hooks/mutations";
import {
  PRODUCT_CATEGORY_OPTIONS,
  productSchema,
  type ProductFormInput,
  type ProductFormValues,
} from "@/lib/validations";

interface ProductFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

type ProductErrors = ReturnType<
  typeof useForm<ProductFormInput, unknown, ProductFormValues>
>["formState"]["errors"];

const extractErrorMessages = (errors: ProductErrors) => ({
  name: errors.name?.message,
  clubOrBrand: errors.clubOrBrand?.message,
  category: errors.category?.message,
  size: errors.size?.message,
  initialQuantity: errors.initialQuantity?.message,
  minStock: errors.minStock?.message,
  costPrice: errors.costPrice?.message,
  salePrice: errors.salePrice?.message,
});

const PRODUCT_FORM_DEFAULTS: ProductFormInput = {
  name: "",
  clubOrBrand: "",
  category: "CAMISA",
  size: "M",
  costPrice: 0,
  salePrice: 0,
  initialQuantity: 0,
  minStock: 0,
};

export const ProductForm = ({ onSuccess, onCancel }: ProductFormProps) => {
  const mutation = useCreateProductMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: PRODUCT_FORM_DEFAULTS,
  });

  const onSubmit = handleSubmit(async (values) => {
    await mutation.mutateAsync(values);
    onSuccess?.();
  });

  const isPending = mutation.isPending || isSubmitting;
  const errorMessages = extractErrorMessages(errors);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField
          label="Nome"
          placeholder="Camisa Brasil 2026 — Home"
          error={errorMessages.name}
          {...register("name")}
        />
        <FormField
          label="Clube ou marca"
          placeholder="Brasil"
          error={errorMessages.clubOrBrand}
          {...register("clubOrBrand")}
        />
        <SelectField
          label="Categoria"
          options={PRODUCT_CATEGORY_OPTIONS}
          error={errorMessages.category}
          {...register("category")}
        />
        <FormField
          label="Tamanho"
          placeholder="M"
          error={errorMessages.size}
          {...register("size")}
        />
        <FormField
          label="Quantidade inicial"
          type="number"
          min={0}
          error={errorMessages.initialQuantity}
          {...register("initialQuantity")}
        />
        <FormField
          label="Estoque mínimo"
          type="number"
          min={0}
          error={errorMessages.minStock}
          {...register("minStock")}
        />
        <FormField
          label="Preço de custo (R$)"
          type="number"
          step="0.01"
          min={0}
          error={errorMessages.costPrice}
          {...register("costPrice")}
        />
        <FormField
          label="Preço de venda (R$)"
          type="number"
          step="0.01"
          min={0}
          error={errorMessages.salePrice}
          {...register("salePrice")}
        />
      </div>
      <p className="font-label text-xs text-on-surface-variant">
        O código interno (FWS-XXXX) é gerado automaticamente.
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
              Salvando...
            </>
          ) : (
            "Cadastrar produto"
          )}
        </Button>
      </div>
    </form>
  );
};
