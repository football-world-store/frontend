import { useState } from "react";

import { Button, Icon, IconButton, Modal, Spinner } from "@/components/atoms";
import { ConfirmDialog } from "@/components/molecules";
import { ProductForm } from "@/components/organisms/ProductForm";
import { useCreateStockEntryMutation } from "@/hooks/mutations";
import type { Product } from "@/types";

interface InventoryModalsProps {
  isCreateOpen: boolean;
  onCloseCreate: () => void;
  editingProduct: Product | null;
  onCloseEdit: () => void;
  pendingDeleteProduct: Product | null;
  onCloseDelete: () => void;
  onConfirmDelete: () => void;
  isDeletePending: boolean;
  addStockProduct: Product | null;
  onCloseAddStock: () => void;
}

const QuickStockForm = ({
  product,
  onSuccess,
  onCancel,
}: {
  product: Product;
  onSuccess: () => void;
  onCancel: () => void;
}) => {
  const mutation = useCreateStockEntryMutation();
  const [quantity, setQuantity] = useState(1);
  const [unitCost, setUnitCost] = useState(
    product.costPrice ? product.costPrice / 100 : 0,
  );
  const [supplier, setSupplier] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutation.mutateAsync({
      productId: product.id,
      quantity,
      unitCost,
      supplier: supplier || undefined,
    });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <span className="font-label text-on-surface-variant text-xs uppercase tracking-wider">
          Quantidade a adicionar
        </span>
        <div className="flex items-center gap-3">
          <IconButton
            iconName="remove"
            label="Diminuir"
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          />
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            min={1}
            className="w-20 h-12 rounded-xl bg-surface-container-lowest text-on-surface text-center font-body text-sm focus-visible:outline-none focus-visible:ring-focus-gold"
          />
          <IconButton
            iconName="add"
            label="Aumentar"
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-label text-on-surface-variant text-xs uppercase tracking-wider">
            Custo unitário (R$)
          </label>
          <input
            type="number"
            step="0.01"
            min={0}
            value={unitCost}
            onChange={(e) => setUnitCost(Number(e.target.value))}
            className="h-12 rounded-xl bg-surface-container-lowest text-on-surface px-4 font-body text-sm focus-visible:outline-none focus-visible:ring-focus-gold"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label text-on-surface-variant text-xs uppercase tracking-wider">
            Fornecedor (opcional)
          </label>
          <input
            type="text"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            placeholder="Distribuidora..."
            className="h-12 rounded-xl bg-surface-container-lowest text-on-surface px-4 font-body text-sm focus-visible:outline-none focus-visible:ring-focus-gold"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <>
              <Spinner size="sm" tone="on-primary" />
              Salvando...
            </>
          ) : (
            <>
              <Icon name="add_circle" size="sm" />
              Adicionar {quantity} un.
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export const InventoryModals = ({
  isCreateOpen,
  onCloseCreate,
  editingProduct,
  onCloseEdit,
  pendingDeleteProduct,
  onCloseDelete,
  onConfirmDelete,
  isDeletePending,
  addStockProduct,
  onCloseAddStock,
}: InventoryModalsProps) => (
  <>
    <Modal
      isOpen={isCreateOpen}
      onClose={onCloseCreate}
      title="Cadastrar produto"
      description="Preencha os dados para adicionar um novo item ao catálogo."
      size="xl"
    >
      <ProductForm onSuccess={onCloseCreate} onCancel={onCloseCreate} />
    </Modal>

    <Modal
      isOpen={editingProduct !== null}
      onClose={onCloseEdit}
      title="Editar produto"
      description={
        editingProduct
          ? `${editingProduct.name} (${editingProduct.internalCode})`
          : undefined
      }
      size="xl"
    >
      {editingProduct ? (
        <ProductForm
          product={editingProduct}
          onSuccess={onCloseEdit}
          onCancel={onCloseEdit}
        />
      ) : null}
    </Modal>

    <Modal
      isOpen={addStockProduct !== null}
      onClose={onCloseAddStock}
      title="Adicionar estoque"
      description={
        addStockProduct
          ? `${addStockProduct.name} · atual: ${addStockProduct.quantity} un.`
          : undefined
      }
      size="md"
    >
      {addStockProduct ? (
        <QuickStockForm
          product={addStockProduct}
          onSuccess={onCloseAddStock}
          onCancel={onCloseAddStock}
        />
      ) : null}
    </Modal>

    <ConfirmDialog
      isOpen={pendingDeleteProduct !== null}
      onClose={onCloseDelete}
      onConfirm={onConfirmDelete}
      title="Excluir produto?"
      description={
        pendingDeleteProduct
          ? `O produto "${pendingDeleteProduct.name}" (${pendingDeleteProduct.internalCode}) será desativado e não aparecerá mais nas listagens. Essa ação pode ser revertida.`
          : undefined
      }
      confirmLabel="Excluir"
      tone="danger"
      isPending={isDeletePending}
    />
  </>
);
