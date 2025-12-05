/**
 * Inventory Hooks - React Query hooks for inventory management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInventoryItems,
  getInventoryItemById,
  getLowStockItems,
  getInventoryCategories,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  adjustInventoryQuantity,
  type InventoryParams,
  type CreateInventoryData,
  type UpdateInventoryData,
} from "./inventory.api";
import { toast } from "sonner";

// ============================================
// QUERY KEYS
// ============================================

export const inventoryKeys = {
  all: ["inventory"] as const,
  lists: () => [...inventoryKeys.all, "list"] as const,
  list: (params: InventoryParams) =>
    [...inventoryKeys.lists(), params] as const,
  details: () => [...inventoryKeys.all, "detail"] as const,
  detail: (id: string) => [...inventoryKeys.details(), id] as const,
  lowStock: () => [...inventoryKeys.all, "low-stock"] as const,
  categories: () => [...inventoryKeys.all, "categories"] as const,
};

// ============================================
// QUERIES
// ============================================

/**
 * Get inventory items with filters
 */
export const useInventoryItems = (params: InventoryParams = {}) => {
  return useQuery({
    queryKey: inventoryKeys.list(params),
    queryFn: () => getInventoryItems(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Get single inventory item
 */
export const useInventoryItem = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: inventoryKeys.detail(id),
    queryFn: () => getInventoryItemById(id),
    enabled: !!id && enabled,
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Get low stock items
 */
export const useLowStockItems = () => {
  return useQuery({
    queryKey: inventoryKeys.lowStock(),
    queryFn: getLowStockItems,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

/**
 * Get inventory categories
 */
export const useInventoryCategories = () => {
  return useQuery({
    queryKey: inventoryKeys.categories(),
    queryFn: getInventoryCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// ============================================
// MUTATIONS
// ============================================

/**
 * Create new inventory item
 */
export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.categories() });
      toast.success("Inventory item created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create inventory item"
      );
    },
  });
};

/**
 * Update inventory item
 */
export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInventoryData }) =>
      updateInventoryItem(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lowStock() });
      toast.success("Inventory item updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update inventory item"
      );
    },
  });
};

/**
 * Delete inventory item
 */
export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lowStock() });
      toast.success("Inventory item deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete inventory item"
      );
    },
  });
};

/**
 * Adjust inventory quantity (add/subtract)
 */
export const useAdjustInventoryQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      adjustment,
      reason,
    }: {
      id: string;
      adjustment: number;
      reason?: string;
    }) => adjustInventoryQuantity(id, adjustment, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lowStock() });

      const action = variables.adjustment > 0 ? "added to" : "removed from";
      toast.success(`Stock ${action} inventory successfully`);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to adjust inventory"
      );
    },
  });
};
