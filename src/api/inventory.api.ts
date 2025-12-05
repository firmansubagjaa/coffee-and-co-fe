/**
 * Inventory API - Stock management endpoints
 */

import apiClient, { ApiResponse } from "./client";

// ============================================
// TYPES
// ============================================

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  threshold_low: number;
  status: "optimal" | "low" | "critical";
  isLowStock?: boolean;
}

export interface InventoryParams {
  search?: string;
  category?: string;
  low_stock?: boolean;
  page?: number;
  limit?: number;
}

interface InventoryResponse {
  items: InventoryItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    lowStockCount?: number;
  };
}

export interface CreateInventoryData {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  threshold_low?: number;
}

export type UpdateInventoryData = Partial<CreateInventoryData>;

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Get all inventory items with filters (Admin only)
 */
export const getInventoryItems = async (
  params: InventoryParams = {}
): Promise<{
  items: InventoryItem[];
  meta: InventoryResponse["meta"];
}> => {
  const response = await apiClient.get<ApiResponse<InventoryResponse>>(
    "/inventory",
    {
      params: {
        search: params.search,
        category: params.category,
        low_stock: params.low_stock,
        page: params.page ?? 1,
        limit: params.limit ?? 10,
      },
    }
  );

  // Handle both response formats (nested items or direct array)
  const data = response.data.data;
  const items = Array.isArray(data) ? data : (data as any).items || [];
  const meta = (data as any).meta || {
    total: items.length,
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    totalPages: 1,
  };

  return { items, meta };
};

/**
 * Get single inventory item (Admin only)
 */
export const getInventoryItemById = async (
  id: string
): Promise<InventoryItem> => {
  const response = await apiClient.get<ApiResponse<InventoryItem>>(
    `/inventory/${id}`
  );
  return response.data.data;
};

/**
 * Get low stock items (Admin only)
 */
export const getLowStockItems = async (): Promise<InventoryItem[]> => {
  const response = await getInventoryItems({ low_stock: true, limit: 100 });
  return response.items;
};

/**
 * Get inventory categories (Admin only)
 */
export const getInventoryCategories = async (): Promise<string[]> => {
  const response = await getInventoryItems({ limit: 1000 });
  const categories = new Set(response.items.map((item) => item.category));
  return Array.from(categories).sort();
};

// ============================================
// ADMIN MUTATIONS
// ============================================

/**
 * Create new inventory item (Admin only)
 */
export const createInventoryItem = async (
  data: CreateInventoryData
): Promise<InventoryItem> => {
  const response = await apiClient.post<ApiResponse<InventoryItem>>(
    "/inventory",
    data
  );
  return response.data.data;
};

/**
 * Update inventory item (Admin only)
 */
export const updateInventoryItem = async (
  id: string,
  data: UpdateInventoryData
): Promise<InventoryItem> => {
  const response = await apiClient.patch<ApiResponse<InventoryItem>>(
    `/inventory/${id}`,
    data
  );
  return response.data.data;
};

/**
 * Delete inventory item (Admin only)
 */
export const deleteInventoryItem = async (id: string): Promise<void> => {
  await apiClient.delete(`/inventory/${id}`);
};

/**
 * Adjust inventory quantity (Admin only)
 */
export const adjustInventoryQuantity = async (
  id: string,
  adjustment: number,
  reason?: string
): Promise<InventoryItem> => {
  // Get current item
  const item = await getInventoryItemById(id);

  // Calculate new quantity
  const newQuantity = Math.max(0, item.quantity + adjustment);

  // Update with new quantity
  return updateInventoryItem(id, { quantity: newQuantity });
};
