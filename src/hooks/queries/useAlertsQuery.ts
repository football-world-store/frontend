import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { alertsService } from "@/services";

export const useAlertsQuery = () =>
  useQuery({
    queryKey: queryKeys.alerts.list(),
    queryFn: alertsService.list,
  });

export const useAlertsCountQuery = () =>
  useQuery({
    queryKey: queryKeys.alerts.count(),
    queryFn: alertsService.count,
  });
