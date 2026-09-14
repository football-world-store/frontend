export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "EXPIRED";

export interface Reservation {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  productSize: string;
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

export interface ListReservationsParams {
  page?: number;
  limit?: number;
  status?: ReservationStatus | "";
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface ConfirmReservationBody {
  id: string;
}

export interface CancelReservationBody {
  id: string;
  cancelReason?: string;
}

export interface CustomerReservation {
  id: string;
  productName: string;
  size: string;
  quantity: number;
  status: ReservationStatus;
  expiresAt: string;
  createdAt: string;
}
