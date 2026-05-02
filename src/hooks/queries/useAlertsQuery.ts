import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { alertsService } from "@/services";

// TODO: Backend endpoint GET /alerts não está implementado ainda
// Descomente quando o backend implementar o endpoint
/*
export const useAlertsQuery = () =>
  useQuery({
    queryKey: queryKeys.alerts.list(),
    queryFn: alertsService.list,
  });
*/

// Versão mockada para desenvolvimento
export const useAlertsQuery = () =>
  useQuery({
    queryKey: queryKeys.alerts.list(),
    queryFn: async () => ({
      items: [],
      total: 0,
    }),
  });
