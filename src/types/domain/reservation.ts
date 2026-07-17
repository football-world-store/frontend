/**
 * Confirmado contra libs/src/database/prisma/schema.prisma (enum
 * ReservationStatus) — os valores TypeScript são em inglês; o `@map(...)`
 * no schema só renomeia a coluna no Postgres, não muda o valor exposto
 * pela API.
 */
export type ReservationStatus =
  "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED";

/**
 * Modelo completo da tabela `reservations` (criada via chatbot público,
 * POST /public/reservations). Distinto de CustomerReservation, que é o
 * shape reduzido devolvido por GET /customer-auth/me/orders.
 */
export interface Reservation {
  id: string;
  productId: string;
  quantity: number;
  customerName: string;
  customerWhatsapp: string;
  customerEmail: string | null;
  notes: string | null;
  status: ReservationStatus;
  expiresAt: string;
  confirmedAt: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  createdAt: string;
}

/**
 * Shape confirmado contra
 * backend/src/modules/customer-auth/use-case/my-orders.use-case.ts
 * (MyReservationResponse) — devolvido dentro de GET /customer-auth/me/orders.
 */
export interface CustomerReservation {
  id: string;
  productName: string;
  size: string;
  quantity: number;
  status: ReservationStatus;
  expiresAt: string;
  createdAt: string;
}
