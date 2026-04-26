import { useMemo, useState } from "react";

import {
  DEFAULT_PAGE_SIZE,
  STOCK_HEALTHY_MULTIPLIER,
  PRICE_CENTS_MULTIPLIER,
} from "@/constants";
import type { Product } from "@/types";
import type { ClawLevel } from "@/components/atoms";

type FilterStatus = "all" | "healthy" | "critical" | "out";

export interface InventoryFilterValues {
  search: string;
  clubOrBrand: string;
  size: string;
  status: FilterStatus;
}

const INITIAL_FILTERS: InventoryFilterValues = {
  search: "",
  clubOrBrand: "",
  size: "",
  status: "all",
};

const STATUS_PREDICATES: Record<FilterStatus, (p: Product) => boolean> = {
  all: () => true,
  out: (p) => p.quantity === 0,
  critical: (p) => p.quantity > 0 && p.quantity <= p.minStock,
  healthy: (p) => p.quantity > p.minStock,
};

const matchesSearch = (p: Product, search: string): boolean =>
  !search || p.name.toLowerCase().includes(search.toLowerCase());

const matchesClubOrBrand = (p: Product, club: string): boolean =>
  !club || p.clubOrBrand === club;

const matchesSize = (p: Product, size: string): boolean =>
  !size || p.size === size;

const matchesFilter = (product: Product, f: InventoryFilterValues): boolean =>
  matchesSearch(product, f.search) &&
  matchesClubOrBrand(product, f.clubOrBrand) &&
  matchesSize(product, f.size) &&
  STATUS_PREDICATES[f.status](product);

export const stockLevel = (product: Product): ClawLevel => {
  if (product.quantity === 0) return 0;
  if (product.quantity <= product.minStock) return 1;
  if (product.quantity <= product.minStock * STOCK_HEALTHY_MULTIPLIER) return 2;
  return 3;
};

export const useInventoryFilters = (products: Product[]) => {
  const [filter, setFilter] = useState<InventoryFilterValues>(INITIAL_FILTERS);
  const [page, setPage] = useState(1);

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / DEFAULT_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * DEFAULT_PAGE_SIZE,
    currentPage * DEFAULT_PAGE_SIZE,
  );

  const totalStockValue = products.reduce(
    (sum, p) => sum + p.salePrice * p.quantity,
    0,
  );
  const criticalCount = products.filter(
    (p) => p.quantity > 0 && p.quantity <= p.minStock,
  ).length;
  const totalSold = products.reduce((sum, p) => sum + p.totalSold, 0);

  const resetFilters = () => {
    setFilter(INITIAL_FILTERS);
    setPage(1);
  };

  const updateFilter = (patch: Partial<InventoryFilterValues>) => {
    setFilter((prev) => ({ ...prev, ...patch }));
    setPage(1);
  };

  return {
    filter,
    updateFilter,
    resetFilters,
    clubOptions,
    sizeOptions,
    filtered,
    pageItems,
    currentPage,
    totalPages,
    page,
    setPage,
    criticalCount,
    totalSold,
    totalStockValue: totalStockValue * PRICE_CENTS_MULTIPLIER,
  };
};
