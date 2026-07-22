"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button, Icon, Spinner } from "@/components/atoms";
import { FormField, SelectField } from "@/components/molecules";
import {
  useCreateProductMutation,
  useCreateStockEntryMutation,
  useDeleteProductPhotoMutation,
  useUpdateProductMutation,
  useUploadProductPhotoMutation,
} from "@/hooks/mutations";
import {
  PRODUCT_CATEGORY_OPTIONS,
  productSchema,
  type ProductFormInput,
  type ProductFormValues,
} from "@/lib/validations";
import type { Product } from "@/types";

interface ProductFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  product?: Product;
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

const buildDefaultsFromProduct = (product: Product): ProductFormInput => ({
  name: product.name,
  clubOrBrand: product.clubOrBrand,
  category: product.category,
  size: product.size,
  costPrice: product.costPrice ?? 0,
  salePrice: product.salePrice,
  initialQuantity: product.quantity,
  minStock: product.minStock,
});

export const ProductForm = ({
  onSuccess,
  onCancel,
  product,
}: ProductFormProps) => {
  const isEditing = Boolean(product);
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const stockEntryMutation = useCreateStockEntryMutation();
  const uploadMutation = useUploadProductPhotoMutation();
  const deletePhotoMutation = useDeleteProductPhotoMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingPhoto, setPendingPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    product?.photoUrl ?? null,
  );
  const [newQuantity, setNewQuantity] = useState<number>(
    product?.quantity ?? 0,
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? buildDefaultsFromProduct(product)
      : PRODUCT_FORM_DEFAULTS,
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imagem muito grande. Máximo 5MB.");
      return;
    }
    setPendingPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const clearPhoto = () => {
    setPendingPhoto(null);
    if (photoPreview && photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveExistingPhoto = () => {
    if (!product) return;
    deletePhotoMutation.mutate(product.id, {
      onSuccess: clearPhoto,
    });
  };

  const onSubmit = handleSubmit(async (values) => {
    const saved = isEditing
      ? await updateMutation.mutateAsync({
          id: product!.id,
          name: values.name,
          clubOrBrand: values.clubOrBrand,
          category: values.category,
          size: values.size,
          costPrice: values.costPrice,
          salePrice: values.salePrice,
          minStock: values.minStock,
        })
      : await createMutation.mutateAsync(values);

    if (isEditing && product) {
      const delta = newQuantity - product.quantity;
      if (delta > 0) {
        await stockEntryMutation.mutateAsync({
          productId: product.id,
          quantity: delta,
          unitCost: values.costPrice,
        });
      }
    }
    if (pendingPhoto) {
      try {
        await uploadMutation.mutateAsync({
          id: saved.id,
          file: pendingPhoto,
        });
      } catch {
        // Toast já é exibido pelo interceptor; o produto foi salvo mesmo assim.
      }
    }
    setPendingPhoto(null);
    if (photoPreview && photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
    onSuccess?.();
  });

  const isSavingProduct =
    createMutation.isPending ||
    updateMutation.isPending ||
    stockEntryMutation.isPending ||
    isSubmitting;
  const isUploadingPhoto = uploadMutation.isPending;
  const isPending = isSavingProduct || isUploadingPhoto;
  const errorMessages = extractErrorMessages(errors);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-2">
        <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
          Foto do produto (opcional)
        </span>
        {pendingPhoto && (
          <p className="font-label text-xs text-on-surface-variant">
            A foto será enviada diretamente para o armazenamento em nuvem após
            salvar.
          </p>
        )}
        <div className="flex items-center gap-4">
          <div className="h-24 w-24 rounded-xl bg-surface-container-low overflow-hidden flex items-center justify-center">
            {photoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoPreview}
                alt="Pré-visualização da foto do produto"
                className="h-full w-full object-cover"
              />
            ) : (
              <Icon
                name="photo_camera"
                size="lg"
                className="text-on-surface-variant"
              />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handlePhotoChange}
              className="hidden"
              aria-label="Selecionar foto do produto"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending}
            >
              <Icon name="upload" size="sm" />
              {pendingPhoto ? "Trocar foto" : "Escolher foto"}
            </Button>
            {pendingPhoto && (
              <span className="font-label text-xs text-on-surface-variant truncate max-w-[140px]">
                {pendingPhoto.name}
              </span>
            )}
            {pendingPhoto ? (
              <Button
                type="button"
                variant="ghost"
                onClick={clearPhoto}
                disabled={isPending}
              >
                Descartar troca
              </Button>
            ) : isEditing && product?.photoUrl && photoPreview ? (
              <Button
                type="button"
                variant="ghost"
                onClick={handleRemoveExistingPhoto}
                disabled={isPending || deletePhotoMutation.isPending}
              >
                {deletePhotoMutation.isPending ? "Removendo…" : "Remover foto"}
              </Button>
            ) : (
              <span className="font-label text-xs text-on-surface-variant">
                JPG, PNG ou WEBP até 5MB.
              </span>
            )}
          </div>
        </div>
      </div>
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
        {isEditing ? (
          <div className="flex flex-col gap-1.5">
            <label className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
              Quantidade em estoque
            </label>
            <input
              type="number"
              min={0}
              value={newQuantity}
              onChange={(e) =>
                setNewQuantity(Math.max(0, Number(e.target.value)))
              }
              className="h-12 rounded-xl bg-surface-container-lowest text-on-surface px-4 font-body text-sm focus-visible:outline-none focus-visible:ring-focus-gold"
            />
            {newQuantity > (product?.quantity ?? 0) && (
              <span className="font-label text-xs text-tertiary">
                +{newQuantity - (product?.quantity ?? 0)} un. serão registradas
                como entrada de estoque.
              </span>
            )}
            {newQuantity < (product?.quantity ?? 0) && (
              <span className="font-label text-xs text-on-surface-variant">
                Reduções de estoque devem ser feitas via saídas ou ajustes.
              </span>
            )}
          </div>
        ) : (
          <FormField
            label="Quantidade inicial"
            type="number"
            min={0}
            error={errorMessages.initialQuantity}
            {...register("initialQuantity")}
          />
        )}
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
        {isEditing
          ? `Código interno: ${product?.internalCode}.`
          : "O código interno (FWS-XXXX) é gerado automaticamente."}
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
              {isUploadingPhoto ? "Enviando foto..." : "Salvando produto..."}
            </>
          ) : isEditing ? (
            "Salvar alterações"
          ) : (
            "Cadastrar produto"
          )}
        </Button>
      </div>
    </form>
  );
};
