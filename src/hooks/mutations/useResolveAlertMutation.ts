import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/constants";
import { alertsService } from "@/services";

export const useResolveAlertMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: alertsService.resolve,
    onSuccess: () => {
      toast.success("Alerta resolvido.");
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.all });
    },
  });
};
