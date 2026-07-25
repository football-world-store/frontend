import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { alertsService } from "@/services";

export const useAlertsQuery = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.alerts.list(),
    queryFn: alertsService.list,
    enabled,
  });

export const useAlertsCountQuery = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.alerts.count(),
    queryFn: alertsService.count,
    enabled,
  });
