import { API_ROUTES, customerApiClient, s3PutObject } from "@/services/api";
import type { ApiEnvelope } from "@/types";
import type {
  AvatarUploadResponse,
  ChangeCustomerPasswordBody,
  CustomerIdentity,
  CustomerProfile,
  RegisterCustomerBody,
  UpdateCustomerProfileBody,
} from "@/types";
import type { CustomerOrders, Sale } from "@/types";
import { isAllowedImageContentType } from "@/utils";

export const customerAuthService = {
  register: async (body: RegisterCustomerBody): Promise<CustomerIdentity> => {
    const { data } = await customerApiClient.post<
      ApiEnvelope<{ customer: CustomerIdentity }>
    >(API_ROUTES.customerAuth.register, body);
    return data.data.customer;
  },

  logout: async (): Promise<void> => {
    await customerApiClient.post(API_ROUTES.customerAuth.logout);
  },

  getProfile: async (): Promise<CustomerProfile> => {
    const { data } = await customerApiClient.get<
      ApiEnvelope<{ customer: CustomerProfile }>
    >(API_ROUTES.customerAuth.me);
    return data.data.customer;
  },

  updateProfile: async (
    body: UpdateCustomerProfileBody,
  ): Promise<CustomerProfile> => {
    const { data } = await customerApiClient.patch<
      ApiEnvelope<{ customer: CustomerProfile }>
    >(API_ROUTES.customerAuth.me, body);
    return data.data.customer;
  },

  changePassword: async (body: ChangeCustomerPasswordBody): Promise<void> => {
    await customerApiClient.post(API_ROUTES.customerAuth.changePassword, body);
  },

  uploadAvatar: async (file: File): Promise<string> => {
    if (!isAllowedImageContentType(file.type)) {
      throw new Error("Formato inválido. Use JPG, JPEG, PNG ou WEBP.");
    }

    const { data } = await customerApiClient.post<
      ApiEnvelope<AvatarUploadResponse>
    >(API_ROUTES.customerAuth.avatarUploadUrl, {
      filename: file.name,
      contentType: file.type,
    });

    await s3PutObject(data.data.uploadUrl, file);
    return data.data.photoUrl;
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
