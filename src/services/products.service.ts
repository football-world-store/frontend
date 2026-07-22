import {
  apiClient,
  API_ROUTES,
  fetchPaginated,
  s3PutObject,
} from "@/services/api";
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
  uploadUrl: string;
}

const ALLOWED_PHOTO_CONTENT_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

const isAllowedContentType = (
  contentType: string,
): contentType is (typeof ALLOWED_PHOTO_CONTENT_TYPES)[number] =>
  (ALLOWED_PHOTO_CONTENT_TYPES as readonly string[]).includes(contentType);

export const productsService = {
  list: async (
    params?: ListProductsParams,
  ): Promise<PaginatedResult<Product>> =>
    fetchPaginated<Product>(apiClient, API_ROUTES.products.list, params),

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

  uploadPhoto: async ({
    id,
    file,
  }: UploadProductPhotoParams): Promise<ProductPhotoResponse> => {
    if (!isAllowedContentType(file.type)) {
      throw new Error("Formato inválido. Use JPG, JPEG, PNG ou WEBP.");
    }

    const { data } = await apiClient.post<ApiEnvelope<ProductPhotoResponse>>(
      API_ROUTES.products.photoUploadUrl,
      { id, filename: file.name, contentType: file.type },
    );

    await s3PutObject(data.data.uploadUrl, file);
    return data.data;
  },

  deletePhoto: async (id: string): Promise<void> => {
    await apiClient.delete(API_ROUTES.products.photo, { data: { id } });
  },

  distinctValues: async (): Promise<{
    clubOrBrand: string[];
    size: string[];
  }> => {
    const { data } = await apiClient.get<
      ApiEnvelope<{ clubOrBrand: string[]; size: string[] }>
    >(API_ROUTES.products.distinctValues);
    return data.data;
  },
};
