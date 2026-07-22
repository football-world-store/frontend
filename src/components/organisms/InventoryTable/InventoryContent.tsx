import { EmptyState, Pagination } from "@/components/molecules";
import type { PaginatedResult, Product } from "@/types";

import { ProductRowDesktop, ProductRowMobile } from "./ProductRow";

interface InventoryContentProps {
  data: PaginatedResult<Product> | undefined;
  pageItems: Product[];
  page: number;
  restoringProductId?: string;
  onPageChange: (page: number) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
  onAddStock: (id: string) => void;
}

export const InventoryContent = ({
  data,
  pageItems,
  page,
  restoringProductId,
  onPageChange,
  onEdit,
  onDelete,
  onRestore,
  onAddStock,
}: InventoryContentProps) => {
  if (pageItems.length === 0) {
    return (
      <EmptyState
        iconName="inventory_2"
        title="Nada por aqui"
        description="Ajuste os filtros ou cadastre um novo produto."
      />
    );
  }

  return (
    <>
      <div className="md:hidden flex flex-col gap-2 rounded-xl overflow-hidden">
        {pageItems.map((product, index) => (
          <ProductRowMobile
            key={product.id}
            product={product}
            index={index}
            isRestoring={restoringProductId === product.id}
            onEdit={onEdit}
            onDelete={onDelete}
            onRestore={onRestore}
            onAddStock={onAddStock}
          />
        ))}
      </div>
      <div className="hidden md:block overflow-x-auto -mx-4 md:mx-0">
        <div className="min-w-[640px] rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 px-4 py-2 font-label uppercase tracking-wider text-xs text-on-surface-variant gap-2">
            <span className="col-span-1"></span>
            <span className="col-span-2">Produto</span>
            <span className="col-span-2">Clube</span>
            <span className="col-span-1">Tam.</span>
            <span className="col-span-2">Categ.</span>
            <span className="col-span-1">Qtd.</span>
            <span className="col-span-2 text-right">Preço</span>
            <span className="col-span-1 text-right">Ações</span>
          </div>
          {pageItems.map((product, index) => (
            <ProductRowDesktop
              key={product.id}
              product={product}
              index={index}
              isRestoring={restoringProductId === product.id}
              onEdit={onEdit}
              onDelete={onDelete}
              onRestore={onRestore}
              onAddStock={onAddStock}
            />
          ))}
        </div>
      </div>

      <Pagination
        page={page}
        totalPages={data?.totalPages ?? 1}
        total={data?.total ?? 0}
        itemCount={pageItems.length}
        itemLabel="produtos"
        onPageChange={onPageChange}
      />
    </>
  );
};
