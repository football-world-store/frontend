import { apiClient, API_ROUTES } from "@/services/api";
import type {
  ApiEnvelope,
  DashboardCapitalByClub,
  DashboardChannel,
  DashboardClubTrendEntry,
  DashboardCustomersByTeam,
  DashboardIdleProducts,
  DashboardMargins,
  MonthlyReport,
  DashboardPaymentMethod,
  DashboardPeriod,
  DashboardReorderItem,
  DashboardReservationConversion,
  DashboardSizes,
  DashboardStockVelocityItem,
  DashboardSummary,
  DashboardTopClub,
  DashboardTopList,
  DashboardTopProduct,
} from "@/types";

const get = async <T>(url: string, params?: unknown): Promise<T> => {
  const { data } = await apiClient.get<ApiEnvelope<T>>(url, { params });
  return data.data;
};

export const dashboardService = {
  monthlyReport: (month: string) =>
    get<MonthlyReport>(API_ROUTES.dashboard.monthlyReport, { month }),

  summary: (params: DashboardPeriod) =>
    get<DashboardSummary>(API_ROUTES.dashboard.summary, params),

  topProducts: (params: DashboardTopList) =>
    get<DashboardTopProduct[]>(API_ROUTES.dashboard.topProducts, params),

  topClubs: (params: DashboardTopList) =>
    get<DashboardTopClub[]>(API_ROUTES.dashboard.topClubs, params),

  sizes: (params: DashboardPeriod) =>
    get<DashboardSizes>(API_ROUTES.dashboard.sizes, params),

  channels: (params: DashboardPeriod) =>
    get<DashboardChannel[]>(API_ROUTES.dashboard.channels, params),

  margins: (params: DashboardPeriod) =>
    get<DashboardMargins>(API_ROUTES.dashboard.margins, params),

  idleProducts: (days?: number) =>
    get<DashboardIdleProducts>(API_ROUTES.dashboard.idleProducts, { days }),

  paymentMethods: (params: DashboardPeriod) =>
    get<DashboardPaymentMethod[]>(API_ROUTES.dashboard.paymentMethods, params),

  stockVelocity: () =>
    get<DashboardStockVelocityItem[]>(API_ROUTES.dashboard.stockVelocity),

  reorderList: () =>
    get<DashboardReorderItem[]>(API_ROUTES.dashboard.reorderList),

  capitalByClub: () =>
    get<DashboardCapitalByClub[]>(API_ROUTES.dashboard.capitalByClub),

  clubTrend: (months?: number) =>
    get<DashboardClubTrendEntry[]>(API_ROUTES.dashboard.clubTrend, {
      months,
    }),

  customersByTeam: () =>
    get<DashboardCustomersByTeam[]>(API_ROUTES.dashboard.customersByTeam),

  reservationConversion: (params: DashboardPeriod) =>
    get<DashboardReservationConversion>(
      API_ROUTES.dashboard.reservationConversion,
      params,
    ),
};
