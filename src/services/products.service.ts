import { apiClient, API_ROUTES } from "@/services/api";
import { HTTP_CONTENT_TYPE, HTTP_HEADER } from "@/constants";
import type { ApiEnvelope, PaginatedResult } from "@/types";
import type {
  CreateProductBody,
  ListProductsParams,
  Product,
  UpdateProductBody,
} from "@/types";

interface UploadProductPhotoParams {
  id: string;
  file: File;
}

interface ProductPhotoResponse {
  url: string;
}

export const productsService = {
  list: async (
    params?: ListProductsParams,
  ): Promise<PaginatedResult<Product>> => {
    const { data } = await apiClient.get<ApiEnvelope<PaginatedResult<Product>>>(
      API_ROUTES.products.list,
      { params },
    );
    return data.data;
  },

  create: async (body: CreateProductBody): Promise<Product> => {
    const { data } = await apiClient.post<ApiEnvelope<Product>>(
      API_ROUTES.products.create,
      body,
    );
    return data.data;
  },

  find: async (id: string): Promise<Product> => {
    const { data } = await apiClient.post<ApiEnvelope<Product>>(
      API_ROUTES.products.find,
      { id },
    );
    return data.data;
  },

  update: async (body: UpdateProductBody): Promise<Product> => {
    const { data } = await apiClient.patch<ApiEnvelope<Product>>(
      API_ROUTES.products.update,
      body,
    );
    return data.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(API_ROUTES.products.delete, { data: { id } });
  },

  restore: async (id: string): Promise<Product> => {
    const { data } = await apiClient.patch<ApiEnvelope<Product>>(
      API_ROUTES.products.restore,
      { id },
    );
    return data.data;
  },

  uploadPhoto: async (
    params: UploadProductPhotoParams,
  ): Promise<ProductPhotoResponse> => {
    const form = new FormData();
    form.append("id", params.id);
    form.append("file", params.file);
    const { data } = await apiClient.post<ApiEnvelope<ProductPhotoResponse>>(
      API_ROUTES.products.photo,
      form,
      { headers: { [HTTP_HEADER.contentType]: HTTP_CONTENT_TYPE.multipart } },
    );
    return data.data;
  },

  deletePhoto: async (id: string): Promise<void> => {
    await apiClient.delete(API_ROUTES.products.photo, { data: { id } });
  },
};
