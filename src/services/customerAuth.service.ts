import { API_ROUTES, customerApiClient } from "@/services/api";
import type { ApiEnvelope } from "@/types";
import type {
  CustomerIdentity,
  RegisterCustomerBody,
  RequestMagicLinkBody,
  VerifyMagicLinkBody,
  VerifyMagicLinkResponseData,
} from "@/types";
import type { CustomerOrders, Sale } from "@/types";

export const customerAuthService = {
  register: async (body: RegisterCustomerBody): Promise<CustomerIdentity> => {
    const { data } = await customerApiClient.post<
      ApiEnvelope<VerifyMagicLinkResponseData>
    >(API_ROUTES.customerAuth.register, body);
    return data.data.customer;
  },

  requestMagicLink: async (body: RequestMagicLinkBody): Promise<void> => {
    await customerApiClient.post(API_ROUTES.customerAuth.magicLink, body);
  },

  verify: async (body: VerifyMagicLinkBody): Promise<CustomerIdentity> => {
    const { data } = await customerApiClient.post<
      ApiEnvelope<VerifyMagicLinkResponseData>
    >(API_ROUTES.customerAuth.verify, body);
    return data.data.customer;
  },

  logout: async (): Promise<void> => {
    await customerApiClient.post(API_ROUTES.customerAuth.logout);
  },

  getOrders: async (): Promise<CustomerOrders> => {
    const { data } = await customerApiClient.get<ApiEnvelope<CustomerOrders>>(
      API_ROUTES.customerAuth.orders,
    );
    return data.data;
  },

  getOrderById: async (id: string): Promise<Sale> => {
    const { data } = await customerApiClient.get<ApiEnvelope<Sale>>(
      API_ROUTES.customerAuth.orderById(id),
    );
    return data.data;
  },
};
