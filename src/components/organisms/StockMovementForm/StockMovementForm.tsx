"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button, Icon, IconButton, Spinner } from "@/components/atoms";
import { FormField, SelectField } from "@/components/molecules";
import { useCreateStockEntryMutation } from "@/hooks/mutations";
import { useProductsQuery } from "@/hooks/queries";
import {
  stockEntrySchema,
  type StockEntryFormInput,
  type StockEntryFormValues,
} from "@/lib/validations";
import { formatPriceFromReais } from "@/utils";

type ActiveTab = "ENTRY" | "REVERSE";
type StockForm = ReturnType<
  typeof useForm<StockEntryFormInput, unknown, StockEntryFormValues>
>;

const STOCK_FORM_DEFAULTS: StockEntryFormInput = {
  productId: "",
  quantity: 1,
  unitCost: 0,
  supplier: "",
  notes: "",
};

const TABS: ReadonlyArray<{ key: ActiveTab; label: string }> = [
  { key: "ENTRY", label: "Registrar entrada" },
  { key: "REVERSE", label: "Estornar entrada" },
];

const extractErrorMessages = (errors: StockForm["formState"]["errors"]) => ({
  productId: errors.productId?.message,
  quantity: errors.quantity?.message,
  unitCost: errors.unitCost?.message,
  supplier: errors.supplier?.message,
  notes: errors.notes?.message,
});

interface TabsProps {
  activeTab: ActiveTab;
  onChange: (tab: ActiveTab) => void;
}

const Tabs = ({ activeTab, onChange }: TabsProps) => (
  <div className="flex gap-2">
    {TABS.map((tab) => (
      <button
        key={tab.key}
        type="button"
        onClick={() => onChange(tab.key)}
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
);

interface QuantityStepperProps {
  value: number;
  disabled: boolean;
  registerProps: ReturnType<StockForm["register"]>;
  onStep: (delta: number) => void;
}

const QuantityStepper = ({
  disabled,
  registerProps,
  onStep,
}: QuantityStepperProps) => (
  <div className="flex flex-col gap-1.5">
    <span className="font-label text-on-surface-variant text-xs uppercase tracking-wider">
      Quantidade
    </span>
    <div className="flex items-center gap-3">
      <IconButton
        iconName="remove"
        label="Diminuir"
        onClick={() => onStep(-1)}
        disabled={disabled}
      />
      <input
        type="number"
        {...registerProps}
        min={1}
        disabled={disabled}
        className="w-20 h-12 rounded-xl bg-surface-container-lowest text-on-surface text-center font-body text-sm focus-visible:outline-none focus-visible:ring-focus-gold disabled:opacity-50"
      />
      <IconButton
        iconName="add"
        label="Aumentar"
        onClick={() => onStep(1)}
        disabled={disabled}
      />
    </div>
  </div>
);

const ReverseHelp = () => (
  <p className="rounded-xl bg-surface-container-low px-4 py-3 font-body text-sm text-on-surface-variant">
    Para estornar, selecione uma movimentação na tabela de histórico e use o
    botão <strong>Estornar</strong>.
  </p>
);

export const StockMovementForm = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("ENTRY");
  const { data } = useProductsQuery();
  const products = data?.items ?? [];
  const mutation = useCreateStockEntryMutation();

  const form = useForm<StockEntryFormInput, unknown, StockEntryFormValues>({
    resolver: zodResolver(stockEntrySchema),
    defaultValues: STOCK_FORM_DEFAULTS,
  });

  const productOptions = [
    { value: "", label: "Selecione um produto" },
    ...products.map((product) => ({
      value: product.id,
      label: `${product.name} — ${product.internalCode}`,
    })),
  ];

  const quantity = Number(form.watch("quantity") ?? 0);
  const unitCost = Number(form.watch("unitCost") ?? 0);
  const estimatedImpact = quantity * unitCost;

  const onSubmit = form.handleSubmit(async (values) => {
    await mutation.mutateAsync(values);
    form.reset(STOCK_FORM_DEFAULTS);
  });

  const handleStep = (delta: number) => {
    const next = Math.max(1, quantity + delta);
    form.setValue("quantity", next, { shouldValidate: true });
  };

  const isPending = mutation.isPending || form.formState.isSubmitting;
  const isReverseTab = activeTab === "REVERSE";
  const errorMessages = extractErrorMessages(form.formState.errors);

  return (
    <form
      onSubmit={onSubmit}
      className="bg-surface-container-high rounded-xl p-6 shadow-ambient flex flex-col gap-5"
      noValidate
    >
      <Tabs activeTab={activeTab} onChange={setActiveTab} />

      {isReverseTab ? <ReverseHelp /> : null}

      <SelectField
        label="Produto"
        options={productOptions}
        error={errorMessages.productId}
        disabled={isReverseTab}
        {...form.register("productId")}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <QuantityStepper
          value={quantity}
          disabled={isReverseTab}
          registerProps={form.register("quantity")}
          onStep={handleStep}
        />
        <FormField
          label="Custo por unidade (R$)"
          type="number"
          step="0.01"
          min={0}
          disabled={isReverseTab}
          error={errorMessages.unitCost}
          {...form.register("unitCost")}
        />
        <FormField
          label="Fornecedor"
          placeholder="Nome do fornecedor"
          disabled={isReverseTab}
          error={errorMessages.supplier}
          {...form.register("supplier")}
        />
        <FormField
          label="Observações (opcional)"
          placeholder="Ex.: Compra promocional"
          disabled={isReverseTab}
          error={errorMessages.notes}
          {...form.register("notes")}
        />
      </div>

      <div className="flex items-center justify-between bg-surface-container-low rounded-xl px-4 py-3">
        <div>
          <p className="font-label uppercase text-xs tracking-wider text-on-surface-variant">
            Impacto estimado
          </p>
          <p className="font-headline text-2xl font-extrabold text-primary">
            +{formatPriceFromReais(estimatedImpact)}
          </p>
        </div>
        <Button type="submit" disabled={isPending || isReverseTab}>
          {isPending ? (
            <>
              <Spinner size="sm" tone="on-primary" />
              Registrando...
            </>
          ) : (
            <>
              <Icon name="check_circle" size="sm" />
              Confirmar entrada
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
