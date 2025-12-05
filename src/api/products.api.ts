/**
 * Products API - Product catalog endpoints
 */

import apiClient, { ApiResponse } from './client';
import { transformProduct, transformProducts, BackendProduct } from './transformers';
import { Product } from '@/types';

// ============================================
// TYPES
// ============================================

export interface ProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
}

interface ProductsResponse {
  products: BackendProduct[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Get paginated products with optional filters
 */
export const getProducts = async (params: ProductsParams = {}): Promise<{
  products: Product[];
  meta: ProductsResponse['meta'];
}> => {
  const response = await apiClient.get<ApiResponse<BackendProduct[]>>('/products', {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 12,
      search: params.search,
      category: params.category,
      sort: params.sort,
    },
  });

  return {
    products: transformProducts(response.data.data),
    meta: response.data.meta ?? {
      total: response.data.data.length,
      page: params.page ?? 1,
      limit: params.limit ?? 12,
      totalPages: 1,
    },
  };
};

/**
 * Get single product by ID
 */
export const getProductById = async (id: string): Promise<Product> => {
  const response = await apiClient.get<ApiResponse<BackendProduct>>(`/products/${id}`);
  return transformProduct(response.data.data);
};

/**
 * Get related products (same category)
 */
export const getRelatedProducts = async (id: string, limit: number = 4): Promise<Product[]> => {
  const response = await apiClient.get<ApiResponse<BackendProduct[]>>(
    `/products/${id}/related`,
    { params: { limit } }
  );
  return transformProducts(response.data.data);
};

// ============================================
// ADMIN ENDPOINTS
// ============================================

export interface CreateProductData {
  name: string;
  description: string;
  category: 'coffee' | 'pastry' | 'merch';
  basePrice: number;
  origin?: string;
  roastLevel?: string;
  tastingNotes?: string[];
  sizes?: { size: string; priceAdjustment: number }[];
  grindOptions?: string[];
  isActive?: boolean;
}

/**
 * Create new product (Admin only)
 */
export const createProduct = async (
  data: CreateProductData,
  images?: File[]
): Promise<Product> => {
  const formData = new FormData();
  formData.append('data', JSON.stringify(data));

  if (images) {
    images.forEach((image) => formData.append('images', image));
  }

  const response = await apiClient.post<ApiResponse<BackendProduct>>('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return transformProduct(response.data.data);
};

/**
 * Update product (Admin only)
 */
export const updateProduct = async (
  id: string,
  data: Partial<CreateProductData>,
  images?: File[]
): Promise<Product> => {
  const formData = new FormData();
  formData.append('data', JSON.stringify(data));

  if (images) {
    images.forEach((image) => formData.append('images', image));
  }

  const response = await apiClient.put<ApiResponse<BackendProduct>>(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return transformProduct(response.data.data);
};

/**
 * Delete product (Admin only)
 */
export const deleteProduct = async (id: string): Promise<void> => {
  await apiClient.delete(`/products/${id}`);
};
