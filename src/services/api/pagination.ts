import type { AxiosInstance } from "axios";

import type { PaginatedResult } from "@/types";

/**
 * Shape real que os endpoints de listagem paginada do backend devolvem —
 * confirmado nos use-cases de list-products, list-sales, list-customers,
 * list-users e list-stock-entries: `{ data: T[], meta: {...} }`, sem o
 * envelope `{ data: {...} }` que o resto da API usa. Provavelmente porque o
 * controller repassa o retorno do use-case direto, sem re-embrulhar.
 */
interface BackendPaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export const fetchPaginated = async <T>(
  client: AxiosInstance,
  url: string,
  params?: unknown,
): Promise<PaginatedResult<T>> => {
  const { data } = await client.get<BackendPaginatedResponse<T>>(url, {
    params,
  });
  return {
    items: data.data,
    page: data.meta.page,
    limit: data.meta.limit,
    total: data.meta.total,
    totalPages: data.meta.totalPages,
  };
};
