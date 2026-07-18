import {
  Badge,
  ClawIndicator,
  IconButton,
  OwnerOnly,
  type ClawLevel,
} from "@/components/atoms";
import type { Product } from "@/types";
import { formatPriceFromReais, zebraRowTier } from "@/utils";

const STOCK_HEALTHY_MULTIPLIER = 2;

const stockLevel = (product: Product): ClawLevel => {
  if (product.quantity === 0) return 0;
  if (product.quantity <= product.minStock) return 1;
  if (product.quantity <= product.minStock * STOCK_HEALTHY_MULTIPLIER) return 2;
  return 3;
};

interface ProductRowProps {
  product: Product;
  index: number;
  isRestoring: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
}

const ProductActions = ({
  product,
  isRestoring,
  onEdit,
  onDelete,
  onRestore,
}: Omit<ProductRowProps, "index">) => (
  <>
    <IconButton
      iconName="edit"
      label={`Editar ${product.name}`}
      filled={false}
      onClick={() => onEdit(product.id)}
    />
    <OwnerOnly>
      {product.isActive ? (
        <IconButton
          iconName="delete"
          label={`Excluir ${product.name}`}
          filled={false}
          onClick={() => onDelete(product.id)}
        />
      ) : (
        <IconButton
          iconName="restore_from_trash"
          label={`Restaurar ${product.name}`}
          filled={false}
          isLoading={isRestoring}
          onClick={() => onRestore(product.id)}
        />
      )}
    </OwnerOnly>
  </>
);

export const ProductRowMobile = (props: ProductRowProps) => {
  const { product, index } = props;
  const level = stockLevel(product);
  return (
    <div className={`flex items-start gap-3 px-4 py-3 ${zebraRowTier(index)}`}>
      <div className="min-w-0 flex-1 space-y-1">
        <span className="block font-body text-sm font-semibold text-on-surface truncate">
          {product.name}
        </span>
        <span className="block font-label text-xs text-on-surface-variant">
          {product.internalCode} · {product.clubOrBrand} · {product.size}
        </span>
        <span className="flex items-center gap-2 font-body text-sm font-semibold text-on-surface">
          <ClawIndicator level={level} />
          {product.quantity} un.
          <span className="text-on-surface-variant">·</span>
          <span className="text-primary">
            {formatPriceFromReais(product.salePrice)}
          </span>
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <ProductActions {...props} />
      </div>
    </div>
  );
};

export const ProductRowDesktop = (props: ProductRowProps) => {
  const { product, index } = props;
  const level = stockLevel(product);
  return (
    <div
      className={`grid grid-cols-12 items-center px-4 py-4 gap-2 transition-colors hover:bg-surface-bright ${zebraRowTier(index)}`}
    >
      <span className="col-span-3 font-body text-sm text-on-surface">
        <span className="block font-semibold">{product.name}</span>
        <span className="block font-label text-xs text-on-surface-variant">
          {product.internalCode}
        </span>
      </span>
      <span className="col-span-2 font-body text-sm text-on-surface">
        {product.clubOrBrand}
      </span>
      <span className="col-span-1 font-body text-sm text-on-surface">
        {product.size}
      </span>
      <span className="col-span-2">
        <Badge>{product.category}</Badge>
      </span>
      <span className="col-span-1 flex items-center gap-2 font-body text-sm font-semibold text-on-surface">
        {product.quantity}
        <ClawIndicator level={level} />
      </span>
      <span className="col-span-2 font-body text-sm text-on-surface text-right">
        {formatPriceFromReais(product.salePrice)}
      </span>
      <span className="col-span-1 flex justify-end gap-1">
        <ProductActions {...props} />
      </span>
    </div>
  );
};
