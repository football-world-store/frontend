import { API_ROUTES, customerApiClient } from "@/services/api";
import type { ApiEnvelope } from "@/types";
import type {
  CustomerIdentity,
  RequestMagicLinkBody,
  VerifyMagicLinkBody,
} from "@/types";
import type { CustomerOrder } from "@/types";

/**
 * PLACEHOLDER — GET /customer-auth/me/orders não tem schema confirmado.
 * Assumimos que cada item tem `saleNumber` só quando é uma venda; caso
 * contrário tratamos como reserva. Ajustar assim que o payload real for
 * observado — idealmente o backend passa a expor um discriminador próprio.
 */
const normalizeCustomerOrder = (raw: unknown): CustomerOrder => {
  const record = raw as Record<string, unknown>;
  const isSale = typeof record.saleNumber === "number";
  return isSale
    ? ({ kind: "sale", ...record } as CustomerOrder)
    : ({ kind: "reservation", ...record } as CustomerOrder);
};

export const customerAuthService = {
  requestMagicLink: async (body: RequestMagicLinkBody): Promise<void> => {
    await customerApiClient.post(API_ROUTES.customerAuth.magicLink, body);
  },

  verify: async (
    body: VerifyMagicLinkBody,
  ): Promise<CustomerIdentity | null> => {
    const { data } = await customerApiClient.post<
      ApiEnvelope<CustomerIdentity> | CustomerIdentity
    >(API_ROUTES.customerAuth.verify, body);
    const envelope = data as ApiEnvelope<CustomerIdentity>;
    return envelope?.data ?? (data as CustomerIdentity) ?? null;
  },

  logout: async (): Promise<void> => {
    await customerApiClient.post(API_ROUTES.customerAuth.logout);
  },

  getOrders: async (): Promise<CustomerOrder[]> => {
    const { data } = await customerApiClient.get<
      ApiEnvelope<unknown[]> | unknown[]
    >(API_ROUTES.customerAuth.orders);
    const rawList = Array.isArray(data)
      ? data
      : ((data as ApiEnvelope<unknown[]>)?.data ?? []);
    return rawList.map(normalizeCustomerOrder);
  },
};
