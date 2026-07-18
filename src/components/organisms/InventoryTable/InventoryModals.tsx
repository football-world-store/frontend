import { Modal } from "@/components/atoms";
import { ConfirmDialog } from "@/components/molecules";
import { ProductForm } from "@/components/organisms/ProductForm";
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
}

export const InventoryModals = ({
  isCreateOpen,
  onCloseCreate,
  editingProduct,
  onCloseEdit,
  pendingDeleteProduct,
  onCloseDelete,
  onConfirmDelete,
  isDeletePending,
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
