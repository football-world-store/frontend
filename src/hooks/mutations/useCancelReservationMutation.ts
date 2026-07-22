import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/constants";
import { reservationsService } from "@/services";

export const useCancelReservationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reservationsService.cancel,
    onSuccess: () => {
      toast.success("Reserva cancelada.");
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
    onError: () => {
      toast.error("Não foi possível cancelar a reserva.");
    },
  });
};
