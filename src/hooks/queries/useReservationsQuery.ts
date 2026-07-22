import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { reservationsService } from "@/services";
import type { ListReservationsParams } from "@/types";

export const useReservationsQuery = (params?: ListReservationsParams) =>
  useQuery({
    queryKey: queryKeys.reservations.list(params),
    queryFn: () => reservationsService.list(params),
  });
