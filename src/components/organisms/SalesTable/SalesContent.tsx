import { EmptyState, Pagination } from "@/components/molecules";
import type { PaginatedResult, Sale } from "@/types";

import { SaleRowDesktop, SaleRowMobile } from "./SaleRow";

interface SalesContentProps {
  inline?: boolean;
  data: PaginatedResult<Sale> | undefined;
  page: number;
  onPageChange: (page: number) => void;
  onCancel: (id: string) => void;
  onViewReceipt: (id: string) => void;
}

export const SalesContent = ({
  inline = false,
  data,
  page,
  onPageChange,
  onCancel,
  onViewReceipt,
}: SalesContentProps) => {
  const sales = data?.items ?? [];

  if (sales.length === 0) {
    return (
      <EmptyState
        iconName="point_of_sale"
        title="Nenhuma venda encontrada"
        description="Ajuste os filtros ou registre uma nova venda."
      />
    );
  }

  return (
    <>
      <div className="md:hidden flex flex-col gap-2 rounded-xl overflow-hidden">
        {sales.map((sale, index) => (
          <SaleRowMobile
            key={sale.id}
            sale={sale}
            index={index}
            onCancel={onCancel}
            onViewReceipt={onViewReceipt}
          />
        ))}
      </div>
      <div className="hidden md:block overflow-x-auto -mx-4 md:mx-0">
        <div className="min-w-[720px] rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 px-4 py-2 font-label uppercase tracking-wider text-xs text-on-surface-variant gap-2">
            <span className="col-span-1">#</span>
            <span className="col-span-3">Cliente</span>
            <span className="col-span-2">Canal</span>
            <span className="col-span-2">Pagamento</span>
            <span className="col-span-2 text-right">Total</span>
            <span className="col-span-1">Status</span>
            <span className="col-span-1 text-right">Ações</span>
          </div>
          {sales.map((sale, index) => (
            <SaleRowDesktop
              key={sale.id}
              sale={sale}
              index={index}
              onCancel={onCancel}
              onViewReceipt={onViewReceipt}
            />
          ))}
        </div>
      </div>

      {inline ? null : (
        <Pagination
          page={page}
          totalPages={data?.totalPages ?? 1}
          total={data?.total ?? 0}
          itemCount={sales.length}
          itemLabel="vendas"
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};
