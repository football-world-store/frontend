"use client";

import { useState } from "react";

import {
  Badge,
  Button,
  ClawIndicator,
  Icon,
  IconButton,
  Input,
  Modal,
  Select,
  Spinner,
} from "@/components/atoms";
import { Card, EmptyState } from "@/components/molecules";
import { ProductForm } from "@/components/organisms/ProductForm";
import { useProductsQuery } from "@/hooks/queries";
import { useInventoryFilters, stockLevel } from "@/hooks/useInventoryFilters";
import { formatCurrencyBRL } from "@/utils";
import { PRICE_CENTS_MULTIPLIER } from "@/constants";

const STATUS_OPTIONS = [
  { value: "all", label: "Todos status" },
  { value: "healthy", label: "Saudável" },
  { value: "critical", label: "Crítico" },
  { value: "out", label: "Esgotado" },
];

export const InventoryTable = () => {
  const { data, isLoading, isError } = useProductsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const products = data ?? [];
  const {
    filter,
    updateFilter,
    resetFilters,
    clubOptions,
    sizeOptions,
    filtered,
    pageItems,
    currentPage,
    totalPages,
    setPage,
    totalStockValue,
    criticalCount,
    totalSold,
  } = useInventoryFilters(products);

  if (isLoading) {
    return (
      <Card title="Gestão de Estoque">
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      </Card>
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
            <Button type="button" onClick={() => setIsModalOpen(true)}>
              <Icon name="add" size="sm" />
              Adicionar produto
            </Button>
          }
        >
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                <Icon name="search" size="sm" />
              </span>
              <Input
                type="search"
                value={filter.search}
                onChange={(e) => updateFilter({ search: e.target.value })}
                placeholder="Filtrar por nome..."
                className="pl-11"
              />
            </div>
            <Select
              options={clubOptions}
              value={filter.clubOrBrand}
              onChange={(e) => updateFilter({ clubOrBrand: e.target.value })}
              className="md:max-w-xs"
            />
            <Select
              options={sizeOptions}
              value={filter.size}
              onChange={(e) => updateFilter({ size: e.target.value })}
              className="md:max-w-[10rem]"
            />
            <Select
              options={STATUS_OPTIONS}
              value={filter.status}
              onChange={(e) =>
                updateFilter({
                  status: e.target.value as typeof filter.status,
                })
              }
              className="md:max-w-[10rem]"
            />
            <Button type="button" variant="ghost" onClick={resetFilters}>
              Limpar
            </Button>
          </div>

          {pageItems.length === 0 ? (
            <EmptyState
              iconName="inventory_2"
              title="Nada por aqui"
              description="Ajuste os filtros ou cadastre um novo produto."
            />
          ) : (
            <div className="rounded-xl overflow-x-auto">
              <table className="w-full min-w-[48rem]">
                <thead>
                  <tr className="font-label uppercase tracking-wider text-xs text-on-surface-variant">
                    <th className="text-left px-4 py-2 font-medium">Produto</th>
                    <th className="text-left px-4 py-2 font-medium">Clube</th>
                    <th className="text-left px-4 py-2 font-medium">Tam.</th>
                    <th className="text-left px-4 py-2 font-medium">Categ.</th>
                    <th className="text-left px-4 py-2 font-medium">Qtd.</th>
                    <th className="text-right px-4 py-2 font-medium">Preço</th>
                    <th className="text-right px-4 py-2 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((product, index) => {
                    const level = stockLevel(product);
                    return (
                      <tr
                        key={product.id}
                        className={`transition-colors hover:bg-surface-bright ${
                          index % 2 === 0
                            ? "bg-surface-container-low"
                            : "bg-surface-container"
                        }`}
                      >
                        <td className="px-4 py-4">
                          <span className="block font-body text-sm font-semibold text-on-surface">
                            {product.name}
                          </span>
                          <span className="block font-label text-xs text-on-surface-variant">
                            {product.internalCode}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-body text-sm text-on-surface">
                          {product.clubOrBrand}
                        </td>
                        <td className="px-4 py-4 font-body text-sm text-on-surface">
                          {product.size}
                        </td>
                        <td className="px-4 py-4">
                          <Badge>{product.category}</Badge>
                        </td>
                        <td className="px-4 py-4">
                          <span className="flex items-center gap-2 font-body text-sm font-semibold text-on-surface">
                            {product.quantity}
                            <ClawIndicator level={level} />
                          </span>
                        </td>
                        <td className="px-4 py-4 font-body text-sm text-on-surface text-right">
                          {formatCurrencyBRL(
                            product.salePrice * PRICE_CENTS_MULTIPLIER,
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span className="flex justify-end gap-1">
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
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
              {formatCurrencyBRL(totalStockValue)}
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
