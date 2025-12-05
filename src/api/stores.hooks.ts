/**
 * Stores Hooks - React Query hooks for stores
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStores,
  getStoreById,
  getActiveStores,
  createStore,
  updateStore,
  deleteStore,
  type StoresParams,
  type CreateStoreData,
  type UpdateStoreData,
} from "./stores.api";
import { toast } from "sonner";

// ============================================
// QUERY KEYS
// ============================================

export const storeKeys = {
  all: ["stores"] as const,
  lists: () => [...storeKeys.all, "list"] as const,
  list: (params: StoresParams) => [...storeKeys.lists(), params] as const,
  details: () => [...storeKeys.all, "detail"] as const,
  detail: (id: string) => [...storeKeys.details(), id] as const,
  active: () => [...storeKeys.all, "active"] as const,
};

// ============================================
// QUERIES
// ============================================

/**
 * Get stores with filters
 */
export const useStores = (params: StoresParams = {}) => {
  return useQuery({
    queryKey: storeKeys.list(params),
    queryFn: () => getStores(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Get single store by ID
 */
export const useStore = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: storeKeys.detail(id),
    queryFn: () => getStoreById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Get active stores only
 */
export const useActiveStores = () => {
  return useQuery({
    queryKey: storeKeys.active(),
    queryFn: getActiveStores,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// ============================================
// MUTATIONS
// ============================================

/**
 * Create new store (Admin)
 */
export const useCreateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
      toast.success("Store created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create store");
    },
  });
};

/**
 * Update store (Admin)
 */
export const useUpdateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStoreData }) =>
      updateStore(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: storeKeys.detail(variables.id),
      });
      toast.success("Store updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update store");
    },
  });
};

/**
 * Delete store (Admin)
 */
export const useDeleteStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
      toast.success("Store deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete store");
    },
  });
};
