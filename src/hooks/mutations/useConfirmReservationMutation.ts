import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/constants";
import { reservationsService } from "@/services";

export const useConfirmReservationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reservationsService.confirm,
    onSuccess: () => {
      toast.success("Reserva confirmada. Estoque atualizado.");
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
    onError: () => {
      toast.error("Não foi possível confirmar a reserva.");
    },
  });
};
