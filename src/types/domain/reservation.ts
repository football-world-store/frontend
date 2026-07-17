/**
 * PLACEHOLDER — status de reserva individual não é documentado no OpenAPI;
 * só vimos valores agregados (confirmed/cancelled/expired) em
 * DashboardReservationConversion. Valores abaixo são inferidos do domínio
 * e devem ser confirmados contra o backend real.
 */
export type ReservationStatus = "CONFIRMADA" | "CANCELADA" | "EXPIRADA";

export interface Reservation {
  id: string;
  productId: string;
  productName: string | null;
  quantity: number;
  customerName: string;
  customerWhatsapp: string;
  customerEmail: string | null;
  notes: string | null;
  status: ReservationStatus;
  createdAt: string;
}
