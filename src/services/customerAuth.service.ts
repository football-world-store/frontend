import { API_ROUTES, customerApiClient } from "@/services/api";
import type { ApiEnvelope } from "@/types";
import type {
  CustomerIdentity,
  RegisterCustomerBody,
  CustomerLoginBody,
  RequestMagicLinkBody,
  VerifyMagicLinkBody,
  VerifyMagicLinkResponseData,
} from "@/types";
import type { CustomerOrders } from "@/types";

export const customerAuthService = {
  register: async (body: RegisterCustomerBody): Promise<CustomerIdentity> => {
    const { data } = await customerApiClient.post<
      ApiEnvelope<VerifyMagicLinkResponseData>
    >(API_ROUTES.customerAuth.register, body);
    return data.data.customer;
  },

  login: async (body: CustomerLoginBody): Promise<CustomerIdentity> => {
    try {
      const { data } = await customerApiClient.post<
        ApiEnvelope<VerifyMagicLinkResponseData>
      >(API_ROUTES.customerAuth.login, body);
      return data.data.customer;
    } catch (err: unknown) {
      // Normaliza para Error nativo cujo .message é o código do backend
      // (ex: "ACCOUNT_PENDING_APPROVAL"), tornando a detecção no onError
      // independente da estrutura interna do AxiosError.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const code = (err as any)?.response?.data?.message;
      throw new Error(typeof code === "string" ? code : "LOGIN_FAILED");
    }
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
};
