/**
 * Multiplicador para converter valores monetários de reais para centavos.
 * Usado em conjunto com `formatCurrencyBRL` que espera valor em centavos.
 */
export const PRICE_CENTS_MULTIPLIER = 100;

/** Itens por página padrão em listagens paginadas. */
export const DEFAULT_PAGE_SIZE = 8;

/** Multiplicador para considerar estoque "saudável" (2× o mínimo). */
export const STOCK_HEALTHY_MULTIPLIER = 2;

/** Limite de gasto para considerar cliente VIP (em reais). */
export const VIP_THRESHOLD = 2000;
