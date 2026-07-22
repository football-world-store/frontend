import { apiClient, API_ROUTES, fetchPaginated } from "@/services/api";
import type {
  ApiEnvelope,
  CancelReservationBody,
  ConfirmReservationBody,
  ListReservationsParams,
  PaginatedResult,
  Reservation,
} from "@/types";

export const reservationsService = {
  list: async (
    params?: ListReservationsParams,
  ): Promise<PaginatedResult<Reservation>> =>
    fetchPaginated<Reservation>(
      apiClient,
      API_ROUTES.reservations.list,
      params,
    ),

  confirm: async (body: ConfirmReservationBody): Promise<Reservation> => {
    const { data } = await apiClient.post<ApiEnvelope<Reservation>>(
      API_ROUTES.reservations.confirm,
      body,
    );
    return data.data;
  },

  cancel: async (body: CancelReservationBody): Promise<Reservation> => {
    const { data } = await apiClient.post<ApiEnvelope<Reservation>>(
      API_ROUTES.reservations.cancel,
      body,
    );
    return data.data;
  },
};
