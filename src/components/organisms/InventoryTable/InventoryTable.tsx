"use client";

import { useMemo, useState } from "react";

import {
  Badge,
  Button,
  ClawIndicator,
  Icon,
  IconButton,
  Modal,
  Select,
  type ClawLevel,
} from "@/components/atoms";
import {
  Card,
  EmptyState,
  SkeletonCard,
  SkeletonTableRow,
} from "@/components/molecules";
import { ProductForm } from "@/components/organisms/ProductForm";
import { useProductsQuery } from "@/hooks/queries";
import type { Product } from "@/types";
import { formatPriceFromReais } from "@/utils";

const ITEMS_PER_PAGE = 8;
const STOCK_HEALTHY_MULTIPLIER = 2;

const stockLevel = (product: Product): ClawLevel => {
  if (product.quantity === 0) return 0;
  if (product.quantity <= product.minStock) return 1;
  if (product.quantity <= product.minStock * STOCK_HEALTHY_MULTIPLIER) return 2;
  return 3;
};

type FilterStatus = "all" | "healthy" | "critical" | "out";

interface FilterValues {
  search: string;
  clubOrBrand: string;
  size: string;
  status: FilterStatus;
}

const matchesSearch = (product: Product, search: string): boolean => {
  if (!search) return true;
  return product.name.toLowerCase().includes(search.toLowerCase());
};

const matchesClubOrBrand = (product: Product, club: string): boolean =>
  !club || product.clubOrBrand === club;

const matchesSize = (product: Product, size: string): boolean =>
  !size || product.size === size;

const STATUS_PREDICATES: Record<FilterStatus, (product: Product) => boolean> = {
  all: () => true,
  out: (product) => product.quantity === 0,
  critical: (product) =>
    product.quantity > 0 && product.quantity <= product.minStock,
  healthy: (product) => product.quantity > product.minStock,
};

const STATUS_OPTIONS = [
  { value: "all", label: "Todos status" },
  { value: "healthy", label: "Saudável" },
  { value: "critical", label: "Crítico" },
  { value: "out", label: "Esgotado" },
];

const matchesFilter = (product: Product, filter: FilterValues): boolean =>
  matchesSearch(product, filter.search) &&
  matchesClubOrBrand(product, filter.clubOrBrand) &&
  matchesSize(product, filter.size) &&
  STATUS_PREDICATES[filter.status](product);

export const InventoryTable = () => {
  const { data, isLoading, isError } = useProductsQuery();
  const [filter, setFilter] = useState<FilterValues>({
    search: "",
    clubOrBrand: "",
    size: "",
    status: "all",
  });
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const products = data?.items ?? [];

  const clubOptions = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.clubOrBrand)));
    return [
      { value: "", label: "Clube / Marca" },
      ...list.map((club) => ({ value: club, label: club })),
    ];
  }, [products]);

  const sizeOptions = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.size)));
    return [
      { value: "", label: "Tamanho" },
      ...list.map((size) => ({ value: size, label: size })),
    ];
  }, [products]);

  const filtered = useMemo(
    () => products.filter((product) => matchesFilter(product, filter)),
    [products, filter],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const totalStockValue = products.reduce(
    (sum, p) => sum + p.salePrice * p.quantity,
    0,
  );
  const criticalCount = products.filter(
    (p) => p.quantity > 0 && p.quantity <= p.minStock,
  ).length;
  const totalSold = products.reduce((sum, p) => sum + p.totalSold, 0);

  const activeFilterCount =
    (filter.clubOrBrand ? 1 : 0) +
    (filter.size ? 1 : 0) +
    (filter.status !== "all" ? 1 : 0);

  const resetFilters = () =>
    setFilter({ search: "", clubOrBrand: "", size: "", status: "all" });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card
          tier="container-high"
          title="Gestão de Estoque"
          description="Catálogo, filtros e disponibilidade em tempo real."
        >
          <SkeletonTableRow count={6} cells={6} />
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SkeletonCard tier="container-highest" bodyLines={1} />
          <SkeletonCard tier="container-highest" bodyLines={1} />
          <SkeletonCard tier="container-highest" bodyLines={1} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Card title="Gestão de Estoque">
        <EmptyState
          iconName="warning"
          title="Não foi possível carregar"
          description="Tente novamente em instantes."
        />
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <Card
          tier="container-high"
          title="Gestão de Estoque"
          description="Catálogo, filtros e disponibilidade em tempo real."
          action={
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto"
            >
              <Icon name="add" size="sm" />
              Adicionar produto
            </Button>
          }
        >
          <div className="mb-6 space-y-3">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  <Icon name="search" size="sm" />
                </span>
                <input
                  type="search"
                  value={filter.search}
                  onChange={(e) =>
                    setFilter((prev) => ({ ...prev, search: e.target.value }))
                  }
                  placeholder="Filtrar por nome..."
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-lowest text-on-surface text-sm focus-visible:outline-none focus-visible:ring-focus-gold"
                />
              </div>
              {activeFilterCount > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetFilters}
                  className="md:hidden"
                >
                  Limpar
                </Button>
              ) : null}
            </div>
            <details className="md:hidden group">
              <summary className="flex h-11 cursor-pointer items-center justify-between rounded-xl bg-surface-container-lowest px-4 font-label text-xs uppercase tracking-wider text-on-surface-variant focus-visible:outline-none focus-visible:ring-focus-gold [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-2">
                  <Icon name="tune" size="sm" />
                  Filtros
                  {activeFilterCount > 0 ? (
                    <Badge tone="primary">{activeFilterCount}</Badge>
                  ) : null}
                </span>
                <Icon
                  name="expand_more"
                  size="sm"
                  className="transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="mt-3 flex flex-col gap-3">
                <Select
                  options={clubOptions}
                  value={filter.clubOrBrand}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      clubOrBrand: e.target.value,
                    }))
                  }
                />
                <Select
                  options={sizeOptions}
                  value={filter.size}
                  onChange={(e) =>
                    setFilter((prev) => ({ ...prev, size: e.target.value }))
                  }
                />
                <Select
                  options={STATUS_OPTIONS}
                  value={filter.status}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      status: e.target.value as FilterValues["status"],
                    }))
                  }
                />
              </div>
            </details>
            <div className="hidden md:flex gap-3">
              <Select
                options={clubOptions}
                value={filter.clubOrBrand}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    clubOrBrand: e.target.value,
                  }))
                }
                className="md:max-w-xs"
              />
              <Select
                options={sizeOptions}
                value={filter.size}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, size: e.target.value }))
                }
                className="md:max-w-[10rem]"
              />
              <Select
                options={STATUS_OPTIONS}
                value={filter.status}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    status: e.target.value as FilterValues["status"],
                  }))
                }
                className="md:max-w-[10rem]"
              />
              <Button type="button" variant="ghost" onClick={resetFilters}>
                Limpar
              </Button>
            </div>
          </div>

          {pageItems.length === 0 ? (
            <EmptyState
              iconName="inventory_2"
              title="Nada por aqui"
              description="Ajuste os filtros ou cadastre um novo produto."
            />
          ) : (
            <>
              <div className="md:hidden flex flex-col gap-2 rounded-xl overflow-hidden">
                {pageItems.map((product, index) => {
                  const level = stockLevel(product);
                  return (
                    <div
                      key={product.id}
                      className={`flex items-start gap-3 px-4 py-3 ${
                        index % 2 === 0
                          ? "bg-surface-container-low"
                          : "bg-surface-container"
                      }`}
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <span className="block font-body text-sm font-semibold text-on-surface truncate">
                          {product.name}
                        </span>
                        <span className="block font-label text-xs text-on-surface-variant">
                          {product.internalCode} · {product.clubOrBrand} ·{" "}
                          {product.size}
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
                      <IconButton iconName="add_shopping_cart" label="Vender" />
                    </div>
                  );
                })}
              </div>
              <div className="hidden md:block overflow-x-auto -mx-4 md:mx-0">
                <div className="min-w-[640px] rounded-xl overflow-hidden">
                  <div className="grid grid-cols-12 px-4 py-2 font-label uppercase tracking-wider text-xs text-on-surface-variant gap-2">
                    <span className="col-span-3">Produto</span>
                    <span className="col-span-2">Clube</span>
                    <span className="col-span-1">Tam.</span>
                    <span className="col-span-2">Categ.</span>
                    <span className="col-span-1">Qtd.</span>
                    <span className="col-span-2 text-right">Preço</span>
                    <span className="col-span-1 text-right">Ações</span>
                  </div>
                  {pageItems.map((product, index) => {
                    const level = stockLevel(product);
                    return (
                      <div
                        key={product.id}
                        className={`grid grid-cols-12 items-center px-4 py-4 gap-2 transition-colors hover:bg-surface-bright ${
                          index % 2 === 0
                            ? "bg-surface-container-low"
                            : "bg-surface-container"
                        }`}
                      >
                        <span className="col-span-3 font-body text-sm text-on-surface">
                          <span className="block font-semibold">
                            {product.name}
                          </span>
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
                          <IconButton
                            iconName="edit"
                            label="Editar"
                            filled={false}
                          />
                          <IconButton
                            iconName="add_shopping_cart"
                            label="Vender"
                          />
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <footer className="flex items-center justify-between pt-4">
            <span className="font-label text-xs text-on-surface-variant">
              Mostrando {pageItems.length} de {filtered.length} produtos
            </span>
            <div className="flex items-center gap-2">
              <IconButton
                iconName="chevron_left"
                label="Anterior"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              />
              <span className="font-label text-xs text-on-surface-variant">
                {currentPage} / {totalPages}
              </span>
              <IconButton
                iconName="chevron_right"
                label="Próxima"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              />
            </div>
          </footer>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card tier="container-highest" title="Valor total em estoque">
            <strong className="font-headline text-2xl font-extrabold text-primary">
              {formatPriceFromReais(totalStockValue)}
            </strong>
          </Card>
          <Card tier="container-highest" title="Itens em crítico">
            <strong className="font-headline text-2xl font-extrabold text-on-surface">
              {criticalCount}
            </strong>
          </Card>
          <Card tier="container-highest" title="Total já vendido">
            <strong className="font-headline text-2xl font-extrabold text-on-surface">
              {totalSold}
            </strong>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cadastrar produto"
        description="Preencha os dados para adicionar um novo item ao catálogo."
        size="xl"
      >
        <ProductForm
          onSuccess={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
};
