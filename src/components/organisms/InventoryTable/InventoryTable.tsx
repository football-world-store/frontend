"use client";

import { useState } from "react";

import { Button, Icon } from "@/components/atoms";
import { Card, EmptyState, SkeletonTableRow } from "@/components/molecules";
import { useDebouncedValue } from "@/hooks";
import {
  useDeleteProductMutation,
  useRestoreProductMutation,
} from "@/hooks/mutations";
import { useProductsQuery } from "@/hooks/queries";

import {
  InventoryFilterBar,
  type InventoryFilterValues,
} from "./InventoryFilterBar";
import { InventoryContent } from "./InventoryContent";
import { InventoryModals } from "./InventoryModals";

const ITEMS_PER_PAGE = 8;
const SEARCH_DEBOUNCE_MS = 300;

const EMPTY_FILTER: InventoryFilterValues = {
  clubOrBrand: "",
  size: "",
  status: "",
};

export const InventoryTable = () => {
  const [includeInactive, setIncludeInactive] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<InventoryFilterValues>(EMPTY_FILTER);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);
  const debouncedClubOrBrand = useDebouncedValue(
    filter.clubOrBrand,
    SEARCH_DEBOUNCE_MS,
  );
  const debouncedSize = useDebouncedValue(filter.size, SEARCH_DEBOUNCE_MS);

  const { data, isLoading, isError } = useProductsQuery({
    page,
    limit: ITEMS_PER_PAGE,
    includeInactive,
    search: debouncedSearch || undefined,
    clubOrBrand: debouncedClubOrBrand || undefined,
    size: debouncedSize || undefined,
    status: filter.status || undefined,
  });

  const products = data?.items ?? [];
  const deleteMutation = useDeleteProductMutation();
  const restoreMutation = useRestoreProductMutation();

  const pendingDeleteProduct = pendingDeleteId
    ? (products.find((p) => p.id === pendingDeleteId) ?? null)
    : null;
  const editingProduct = editingProductId
    ? (products.find((p) => p.id === editingProductId) ?? null)
    : null;
  const restoringProductId = restoreMutation.isPending
    ? (restoreMutation.variables as string | undefined)
    : undefined;

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return;
    deleteMutation.mutate(pendingDeleteId, {
      onSettled: () => setPendingDeleteId(null),
    });
  };

  const resetFilters = () => {
    setFilter(EMPTY_FILTER);
    setPage(1);
  };

  const updateFilter = (patch: Partial<InventoryFilterValues>) => {
    setFilter((prev) => ({ ...prev, ...patch }));
    setPage(1);
  };

  const updateIncludeInactive = (value: boolean) => {
    setIncludeInactive(value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <Card
        tier="container-high"
        title="Gestão de Estoque"
        description="Catálogo, filtros e disponibilidade em tempo real."
      >
        <SkeletonTableRow count={6} cells={6} />
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
        <div className="relative mb-3">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
            <Icon name="search" size="sm" />
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por nome ou código..."
            className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-lowest text-on-surface text-sm focus-visible:outline-none focus-visible:ring-focus-gold"
          />
        </div>
        <InventoryFilterBar
          filter={filter}
          includeInactive={includeInactive}
          onChangeFilter={updateFilter}
          onChangeIncludeInactive={updateIncludeInactive}
          onReset={resetFilters}
        />

        <InventoryContent
          data={data}
          pageItems={products}
          page={page}
          restoringProductId={restoringProductId}
          onPageChange={setPage}
          onEdit={setEditingProductId}
          onDelete={setPendingDeleteId}
          onRestore={(id) => restoreMutation.mutate(id)}
        />
      </Card>

      <InventoryModals
        isCreateOpen={isModalOpen}
        onCloseCreate={() => setIsModalOpen(false)}
        editingProduct={editingProduct}
        onCloseEdit={() => setEditingProductId(null)}
        pendingDeleteProduct={pendingDeleteProduct}
        onCloseDelete={() => setPendingDeleteId(null)}
        onConfirmDelete={handleConfirmDelete}
        isDeletePending={deleteMutation.isPending}
      />
    </>
  );
};
