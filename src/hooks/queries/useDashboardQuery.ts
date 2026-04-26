import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { dashboardService } from "@/services";

export const useDashboardStatsQuery = () =>
  useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: dashboardService.stats,
  });
