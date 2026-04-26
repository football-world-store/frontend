"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button, Icon, IconButton, Input, Spinner } from "@/components/atoms";
import { FormField, SelectField } from "@/components/molecules";
import { useCreateStockEntryMutation } from "@/hooks/mutations";
import { useProductsQuery } from "@/hooks/queries";
import {
  stockEntrySchema,
  type StockEntryFormInput,
  type StockEntryFormValues,
} from "@/lib/validations";
import { formatCurrencyBRL } from "@/utils";

type ActiveTab = "ENTRY" | "REVERSE";

const todayIso = () => new Date().toISOString().slice(0, 10);

const STOCK_FORM_DEFAULTS: StockEntryFormInput = {
  productId: "",
  type: "ENTRY",
  quantity: 1,
  unitCost: 0,
  supplier: "",
  registeredAt: todayIso(),
};

type StockErrors = ReturnType<
  typeof useForm<StockEntryFormInput, unknown, StockEntryFormValues>
>["formState"]["errors"];

const extractErrorMessages = (errors: StockErrors) => ({
  productId: errors.productId?.message,
  unitCost: errors.unitCost?.message,
  supplier: errors.supplier?.message,
  registeredAt: errors.registeredAt?.message,
});

export const StockMovementForm = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("ENTRY");
  const { data: products } = useProductsQuery();
  const mutation = useCreateStockEntryMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StockEntryFormInput, unknown, StockEntryFormValues>({
    resolver: zodResolver(stockEntrySchema),
    defaultValues: { ...STOCK_FORM_DEFAULTS, registeredAt: todayIso() },
  });

  const productOptions = [
    { value: "", label: "Selecione um produto" },
    ...(products ?? []).map((product) => ({
      value: product.id,
      label: `${product.name} — ${product.internalCode}`,
    })),
  ];

  const quantity = Number(watch("quantity") ?? 0);
  const unitCost = Number(watch("unitCost") ?? 0);
  const estimatedImpact =
    quantity * unitCost * (activeTab === "ENTRY" ? 1 : -1);

  const onSubmit = handleSubmit(async (values) => {
    await mutation.mutateAsync({ ...values, type: activeTab });
    reset({
      ...STOCK_FORM_DEFAULTS,
      type: activeTab,
      registeredAt: todayIso(),
    });
  });

  const handleStep = (delta: number) => {
    const next = Math.max(1, quantity + delta);
    setValue("quantity", next, { shouldValidate: true });
  };

  const isPending = mutation.isPending || isSubmitting;
  const errorMessages = extractErrorMessages(errors);

  return (
    <form
      onSubmit={onSubmit}
      className="bg-surface-container-high rounded-xl p-6 shadow-ambient flex flex-col gap-5"
      noValidate
    >
      <div className="flex gap-2">
        {(
          [
            { key: "ENTRY", label: "Registrar entrada" },
            { key: "REVERSE", label: "Registrar saída/venda" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => {
              setActiveTab(tab.key);
              setValue("type", tab.key);
            }}
            className={`rounded-pill px-4 py-2 font-label text-xs uppercase tracking-wider font-semibold transition-colors ${
              activeTab === tab.key
                ? "bg-metallic text-on-primary"
                : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <SelectField
        label="Buscar produto"
        options={productOptions}
        error={errorMessages.productId}
        {...register("productId")}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <span className="font-label text-on-surface-variant text-xs uppercase tracking-wider">
            Quantidade
          </span>
          <div className="flex items-center gap-3">
            <IconButton
              iconName="remove"
              label="Diminuir"
              onClick={() => handleStep(-1)}
            />
            <Input
              type="number"
              {...register("quantity")}
              min={1}
              className="w-20 text-center"
            />
            <IconButton
              iconName="add"
              label="Aumentar"
              onClick={() => handleStep(1)}
            />
          </div>
        </div>
        <FormField
          label="Custo por unidade (R$)"
          type="number"
          step="0.01"
          min={0}
          error={errorMessages.unitCost}
          {...register("unitCost")}
        />
        <FormField
          label="Fornecedor"
          placeholder="Selecione o fornecedor"
          error={errorMessages.supplier}
          {...register("supplier")}
        />
        <FormField
          label="Data da movimentação"
          type="date"
          error={errorMessages.registeredAt}
          {...register("registeredAt")}
        />
      </div>

      <div className="flex items-center justify-between bg-surface-container-low rounded-xl px-4 py-3">
        <div>
          <p className="font-label uppercase text-xs tracking-wider text-on-surface-variant">
            Impacto estimado
          </p>
          <p
            className={`font-headline text-2xl font-extrabold ${
              estimatedImpact >= 0 ? "text-primary" : "text-error"
            }`}
          >
            {estimatedImpact >= 0 ? "+" : ""}
            {formatCurrencyBRL(estimatedImpact * 100)}
          </p>
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner size="sm" tone="on-primary" />
              Registrando...
            </>
          ) : (
            <>
              <Icon name="check_circle" size="sm" />
              Confirmar registro
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
