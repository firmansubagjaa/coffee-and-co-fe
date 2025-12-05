/**
 * Orders Hooks - React Query hooks for orders
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import * as ordersApi from './orders.api';
import { cartKeys } from './cart.hooks';
import { useIsAuthenticated } from '@/features/auth/store';
import { CartItem, PaymentMethod } from '@/types';

// Query Keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (params: { page?: number }) => [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  active: () => [...orderKeys.all, 'active'] as const,
};

/**
 * Get order history
 */
export const useOrders = (params: { page?: number; limit?: number } = {}) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => ordersApi.getOrders(params),
    enabled: isAuthenticated,
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Get my order history (customer endpoint)
 */
export const useMyOrders = (params: { page?: number; limit?: number } = {}) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: [...orderKeys.all, 'my-orders', params] as const,
    queryFn: () => ordersApi.getMyOrders(params),
    enabled: isAuthenticated,
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Infinite scroll order history
 */
export const useInfiniteOrders = () => {
  const isAuthenticated = useIsAuthenticated();

  return useInfiniteQuery({
    queryKey: orderKeys.lists(),
    queryFn: ({ pageParam = 1 }) => ordersApi.getOrders({ page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });
};

/**
 * Get single order
 */
export const useOrder = (id: string | undefined) => {
  return useQuery({
    queryKey: orderKeys.detail(id ?? ''),
    queryFn: () => ordersApi.getOrderById(id!),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
};

/**
 * Get active orders (for barista)
 */
export const useActiveOrders = () => {
  return useQuery({
    queryKey: orderKeys.active(),
    queryFn: ordersApi.getActiveOrders,
    refetchInterval: 10 * 1000, // Poll every 10 seconds
    staleTime: 5 * 1000,
  });
};

/**
 * Create order mutation
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cartItems,
      details,
    }: {
      cartItems: CartItem[];
      details: {
        location?: string;
        paymentMethod: PaymentMethod;
        deliveryAddress?: string;
        deliveryNote?: string;
      };
    }) => ordersApi.createOrderFromCart(cartItems, details),
    onSuccess: () => {
      // Invalidate orders and clear cart
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.setQueryData(cartKeys.items(), []);
    },
  });
};

/**
 * Update order status (barista/admin)
 */
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: 'preparing' | 'ready' | 'completed' | 'cancelled';
    }) => ordersApi.updateOrderStatus(id, status),
    onSuccess: (updatedOrder) => {
      // Update cache
      queryClient.setQueryData(orderKeys.detail(updatedOrder.id), updatedOrder);
      queryClient.invalidateQueries({ queryKey: orderKeys.active() });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
};
