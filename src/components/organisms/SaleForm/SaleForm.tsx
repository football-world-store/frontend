"use client";

import { useMemo, useState } from "react";

import { Badge, Button, Icon, IconButton, Spinner } from "@/components/atoms";
import { FormField, SelectField } from "@/components/molecules";
import { useCreateSaleMutation } from "@/hooks/mutations";
import { useProductsQuery } from "@/hooks/queries";
import type {
  CreateSaleItemBody,
  PaymentMethod,
  Product,
  SaleChannel,
} from "@/types";
import { formatPriceFromReais } from "@/utils";

interface SaleFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface DraftItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

const CHANNEL_OPTIONS: { value: SaleChannel; label: string }[] = [
  { value: "LOJA_FISICA", label: "Loja física" },
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "SITE", label: "Site" },
];

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: "DINHEIRO", label: "Dinheiro" },
  { value: "PIX", label: "PIX" },
  { value: "DEBITO", label: "Débito" },
  { value: "CREDITO", label: "Crédito" },
];

const findProduct = (products: Product[], id: string) =>
  products.find((p) => p.id === id) ?? null;

export const SaleForm = ({ onSuccess, onCancel }: SaleFormProps) => {
  const { data: productsResult, isLoading } = useProductsQuery();
  const products = useMemo(
    () => (productsResult?.items ?? []).filter((p) => p.quantity > 0),
    [productsResult],
  );
  const mutation = useCreateSaleMutation();

  const [items, setItems] = useState<DraftItem[]>([]);
  const [channel, setChannel] = useState<SaleChannel>("LOJA_FISICA");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("PIX");
  const [discountInput, setDiscountInput] = useState("0");
  const [productPickerId, setProductPickerId] = useState("");

  const productOptions = useMemo(
    () => [
      { value: "", label: "Selecione um produto" },
      ...products.map((p) => ({
        value: p.id,
        label: `${p.name} (${p.size}) — ${p.quantity} em estoque`,
      })),
    ],
    [products],
  );

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const discount = Math.max(0, Number(discountInput) || 0);
  const total = Math.max(0, subtotal - discount);

  const addItem = () => {
    if (!productPickerId) return;
    const product = findProduct(products, productPickerId);
    if (!product) return;
    if (items.some((i) => i.productId === product.id)) {
      setProductPickerId("");
      return;
    }
    setItems((prev) => [
      ...prev,
      { productId: product.id, quantity: 1, unitPrice: product.salePrice },
    ]);
    setProductPickerId("");
  };

  const updateItem = (productId: string, patch: Partial<DraftItem>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, ...patch } : item,
      ),
    );
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const canSubmit = items.length > 0 && total > 0 && !mutation.isPending;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    const payload: CreateSaleItemBody[] = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));
    mutation.mutate(
      {
        items: payload,
        channel,
        paymentMethod,
        discount: discount || undefined,
      },
      {
        onSuccess: () => {
          setItems([]);
          setDiscountInput("0");
          onSuccess?.();
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" tone="primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-3">
        <span className="font-label uppercase tracking-wider text-xs text-on-surface-variant">
          Itens da venda
        </span>
        <div className="flex gap-2">
          <SelectField
            label=""
            options={productOptions}
            value={productPickerId}
            onChange={(event) => setProductPickerId(event.target.value)}
            className="flex-1"
            aria-label="Selecionar produto"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={addItem}
            disabled={!productPickerId}
          >
            <Icon name="add" size="sm" />
            Adicionar
          </Button>
        </div>

        {items.length === 0 ? (
          <p className="rounded-xl bg-surface-container-low px-4 py-6 text-center font-label text-xs text-on-surface-variant">
            Adicione ao menos um produto para registrar a venda.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((item) => {
              const product = findProduct(products, item.productId);
              if (!product) return null;
              const lineTotal = item.unitPrice * item.quantity;
              return (
                <li
                  key={item.productId}
                  className="grid grid-cols-12 items-center gap-3 rounded-xl bg-surface-container-low px-4 py-3"
                >
                  <div className="col-span-12 sm:col-span-5 min-w-0">
                    <p className="font-body text-sm font-semibold text-on-surface truncate">
                      {product.name}
                    </p>
                    <p className="font-label text-xs text-on-surface-variant">
                      {product.size} · {product.internalCode}
                    </p>
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <input
                      type="number"
                      min={1}
                      max={product.quantity}
                      value={item.quantity}
                      onChange={(event) =>
                        updateItem(item.productId, {
                          quantity: Math.max(
                            1,
                            Math.min(
                              product.quantity,
                              Number(event.target.value) || 1,
                            ),
                          ),
                        })
                      }
                      className="w-full h-10 rounded-xl bg-surface-container-lowest text-on-surface text-center font-body text-sm focus-visible:outline-none focus-visible:ring-focus-gold"
                      aria-label={`Quantidade de ${product.name}`}
                    />
                  </div>
                  <div className="col-span-5 sm:col-span-3">
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      value={item.unitPrice}
                      onChange={(event) =>
                        updateItem(item.productId, {
                          unitPrice: Math.max(0, Number(event.target.value)),
                        })
                      }
                      className="w-full h-10 rounded-xl bg-surface-container-lowest text-on-surface text-right font-body text-sm px-3 focus-visible:outline-none focus-visible:ring-focus-gold"
                      aria-label={`Preço unitário de ${product.name}`}
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex items-center justify-end">
                    <Badge tone="primary">
                      {formatPriceFromReais(lineTotal)}
                    </Badge>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <IconButton
                      iconName="close"
                      label={`Remover ${product.name}`}
                      onClick={() => removeItem(item.productId)}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SelectField
          label="Canal"
          options={CHANNEL_OPTIONS}
          value={channel}
          onChange={(event) => setChannel(event.target.value as SaleChannel)}
        />
        <SelectField
          label="Forma de pagamento"
          options={PAYMENT_OPTIONS}
          value={paymentMethod}
          onChange={(event) =>
            setPaymentMethod(event.target.value as PaymentMethod)
          }
        />
        <FormField
          label="Desconto (R$)"
          type="number"
          step="0.01"
          min={0}
          value={discountInput}
          onChange={(event) => setDiscountInput(event.target.value)}
        />
      </div>

      <div className="rounded-xl bg-surface-container-high p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
            Total a receber
          </span>
          <strong className="font-headline text-3xl font-extrabold text-primary">
            {formatPriceFromReais(total)}
          </strong>
          <span className="font-label text-xs text-on-surface-variant">
            Subtotal {formatPriceFromReais(subtotal)} · Desconto{" "}
            {formatPriceFromReais(discount)}
          </span>
        </div>
        <div className="flex gap-3">
          {onCancel ? (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
          ) : null}
          <Button type="submit" disabled={!canSubmit}>
            {mutation.isPending ? (
              <>
                <Spinner size="sm" tone="on-primary" />
                Registrando…
              </>
            ) : (
              <>
                <Icon name="check_circle" size="sm" />
                Confirmar venda
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};
