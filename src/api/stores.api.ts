/**
 * Stores API - Store locations endpoints
 */

import apiClient, { ApiResponse } from "./client";

// ============================================
// TYPES
// ============================================

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  opening_hours?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StoresParams {
  search?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
}

interface StoresResponse {
  stores: Store[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateStoreData {
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  opening_hours?: string;
  is_active?: boolean;
}

export type UpdateStoreData = Partial<CreateStoreData>;

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Get all stores with optional filters
 */
export const getStores = async (
  params: StoresParams = {}
): Promise<{
  stores: Store[];
  meta: StoresResponse["meta"];
}> => {
  const response = await apiClient.get<ApiResponse<Store[]>>("/stores", {
    params: {
      search: params.search,
      is_active: params.is_active,
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    },
  });

  return {
    stores: response.data.data,
    meta: response.data.meta ?? {
      total: response.data.data.length,
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      totalPages: 1,
    },
  };
};

/**
 * Get single store by ID
 */
export const getStoreById = async (id: string): Promise<Store> => {
  const response = await apiClient.get<ApiResponse<Store>>(`/stores/${id}`);
  return response.data.data;
};

/**
 * Get active stores (public endpoint)
 */
export const getActiveStores = async (): Promise<Store[]> => {
  const response = await getStores({ is_active: true, limit: 100 });
  return response.stores;
};

// ============================================
// ADMIN ENDPOINTS
// ============================================

/**
 * Create new store (Admin only)
 */
export const createStore = async (data: CreateStoreData): Promise<Store> => {
  const response = await apiClient.post<ApiResponse<Store>>("/stores", data);
  return response.data.data;
};

/**
 * Update store (Admin only)
 */
export const updateStore = async (
  id: string,
  data: UpdateStoreData
): Promise<Store> => {
  const response = await apiClient.patch<ApiResponse<Store>>(
    `/stores/${id}`,
    data
  );
  return response.data.data;
};

/**
 * Delete store (Admin only)
 */
export const deleteStore = async (id: string): Promise<void> => {
  await apiClient.delete(`/stores/${id}`);
};
