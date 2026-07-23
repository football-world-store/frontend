import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { dashboardService } from "@/services";
import type { DashboardPeriod, DashboardTopList } from "@/types";

export const useDashboardSummaryQuery = (
  params: DashboardPeriod,
  enabled = true,
) =>
  useQuery({
    queryKey: queryKeys.dashboard.summary(params),
    queryFn: () => dashboardService.summary(params),
    enabled,
  });

export const useDashboardTopProductsQuery = (params: DashboardTopList) =>
  useQuery({
    queryKey: queryKeys.dashboard.topProducts(params),
    queryFn: () => dashboardService.topProducts(params),
  });

export const useDashboardTopClubsQuery = (params: DashboardTopList) =>
  useQuery({
    queryKey: queryKeys.dashboard.topClubs(params),
    queryFn: () => dashboardService.topClubs(params),
  });

export const useDashboardSizesQuery = (params: DashboardPeriod) =>
  useQuery({
    queryKey: queryKeys.dashboard.sizes(params),
    queryFn: () => dashboardService.sizes(params),
  });

export const useDashboardChannelsQuery = (params: DashboardPeriod) =>
  useQuery({
    queryKey: queryKeys.dashboard.channels(params),
    queryFn: () => dashboardService.channels(params),
  });

export const useDashboardMarginsQuery = (params: DashboardPeriod) =>
  useQuery({
    queryKey: queryKeys.dashboard.margins(params),
    queryFn: () => dashboardService.margins(params),
  });

export const useDashboardIdleProductsQuery = (days?: number) =>
  useQuery({
    queryKey: queryKeys.dashboard.idleProducts(days),
    queryFn: () => dashboardService.idleProducts(days),
  });

export const useDashboardPaymentMethodsQuery = (params: DashboardPeriod) =>
  useQuery({
    queryKey: queryKeys.dashboard.paymentMethods(params),
    queryFn: () => dashboardService.paymentMethods(params),
  });

export const useDashboardStockVelocityQuery = () =>
  useQuery({
    queryKey: queryKeys.dashboard.stockVelocity(),
    queryFn: dashboardService.stockVelocity,
  });

export const useDashboardReorderListQuery = () =>
  useQuery({
    queryKey: queryKeys.dashboard.reorderList(),
    queryFn: dashboardService.reorderList,
  });

export const useDashboardCapitalByClubQuery = () =>
  useQuery({
    queryKey: queryKeys.dashboard.capitalByClub(),
    queryFn: dashboardService.capitalByClub,
  });

export const useDashboardClubTrendQuery = (months?: number) =>
  useQuery({
    queryKey: queryKeys.dashboard.clubTrend(months),
    queryFn: () => dashboardService.clubTrend(months),
  });

export const useDashboardCustomersByTeamQuery = () =>
  useQuery({
    queryKey: queryKeys.dashboard.customersByTeam(),
    queryFn: dashboardService.customersByTeam,
  });

export const useDashboardReservationConversionQuery = (
  params: DashboardPeriod,
) =>
  useQuery({
    queryKey: queryKeys.dashboard.reservationConversion(params),
    queryFn: () => dashboardService.reservationConversion(params),
  });
