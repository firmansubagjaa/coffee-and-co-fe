/**
 * Products Hooks - React Query hooks for products
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import * as productsApi from './products.api';
import type { ProductsParams, CreateProductData } from './products.api';
import { Product } from '@/types';

// Query Keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: ProductsParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  related: (id: string) => [...productKeys.all, 'related', id] as const,
};

/**
 * Get products with filters
 */
export const useProducts = (params: ProductsParams = {}) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productsApi.getProducts(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Infinite scroll products
 */
export const useInfiniteProducts = (params: Omit<ProductsParams, 'page'> = {}) => {
  return useInfiniteQuery({
    queryKey: [...productKeys.lists(), 'infinite', params] as const,
    queryFn: ({ pageParam = 1 }) =>
      productsApi.getProducts({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Get single product
 */
export const useProduct = (id: string | undefined) => {
  return useQuery({
    queryKey: productKeys.detail(id ?? ''),
    queryFn: () => productsApi.getProductById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Get related products
 */
export const useRelatedProducts = (id: string | undefined, limit: number = 4) => {
  return useQuery({
    queryKey: productKeys.related(id ?? ''),
    queryFn: () => productsApi.getRelatedProducts(id!, limit),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// ADMIN MUTATIONS
// ============================================

/**
 * Create product mutation
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, images }: { data: CreateProductData; images?: File[] }) =>
      productsApi.createProduct(data, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

/**
 * Update product mutation
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      images,
    }: {
      id: string;
      data: Partial<CreateProductData>;
      images?: File[];
    }) => productsApi.updateProduct(id, data, images),
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.setQueryData(productKeys.detail(updatedProduct.id), updatedProduct);
    },
  });
};

/**
 * Delete product mutation
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsApi.deleteProduct(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.removeQueries({ queryKey: productKeys.detail(deletedId) });
    },
  });
};

// ============================================
// PREFETCH HELPERS
// ============================================

/**
 * Prefetch product for navigation
 */
export const usePrefetchProduct = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: productKeys.detail(id),
      queryFn: () => productsApi.getProductById(id),
      staleTime: 5 * 60 * 1000,
    });
  };
};
