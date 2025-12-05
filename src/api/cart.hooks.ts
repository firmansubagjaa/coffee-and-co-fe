/**
 * Cart Hooks - React Query hooks with hybrid sync
 * 
 * Strategy:
 * - Guest: LocalStorage via Zustand (immediate)
 * - Authenticated: Server sync + LocalStorage backup
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as cartApi from './cart.api';
import { useIsAuthenticated } from '@/features/auth/store';
import { useCartStore } from '@/features/cart/store';
import { CartItem } from '@/types';

// Query Keys
export const cartKeys = {
  all: ['cart'] as const,
  items: () => [...cartKeys.all, 'items'] as const,
};

/**
 * Get cart - REQUIRES AUTHENTICATION
 * Guests will see empty cart and must login
 */
export const useCart = () => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: cartKeys.items(),
    queryFn: cartApi.getCart,
    enabled: isAuthenticated,  // Only fetch if authenticated
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Add to cart mutation - REQUIRES AUTHENTICATION
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const isAuthenticated = useIsAuthenticated();

  return useMutation({
    mutationFn: (data: cartApi.AddToCartRequest) => {
      if (!isAuthenticated) {
        throw new Error('Authentication required to add items to cart');
      }
      return cartApi.addToCart(data);
    },
    onSuccess: (serverItems) => {
      // Backend now returns full cart, so we can update directly!
      if (serverItems) {
        queryClient.setQueryData(cartKeys.items(), serverItems);
      }
    },
  });
};

/**
 * Update cart item quantity - REQUIRES AUTHENTICATION
 */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  const isAuthenticated = useIsAuthenticated();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (!isAuthenticated) {
        throw new Error('Authentication required');
      }
      return cartApi.updateCartItem(itemId, quantity);
    },
    onMutate: async ({ itemId, quantity }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: cartKeys.items() });
      const previous = queryClient.getQueryData<CartItem[]>(cartKeys.items());
      
      queryClient.setQueryData<CartItem[]>(cartKeys.items(), (old) =>
        old?.map((item) =>
          item.cartId === itemId ? { ...item, quantity } : item
        ).filter((item) => item.quantity > 0)
      );
      
      return { previous };
    },
    onError: (error: any, __, context) => {
      // If 404, item is gone, invalidate to refresh
      if (error?.response?.status === 404) {
        queryClient.invalidateQueries({ queryKey: cartKeys.items() });
        return;
      }

      if (context?.previous) {
        queryClient.setQueryData(cartKeys.items(), context.previous);
      }
    },
    onSuccess: (serverItems) => {
      if (serverItems) {
        queryClient.setQueryData(cartKeys.items(), serverItems);
      }
    },
  });
};

/**
 * Remove cart item - REQUIRES AUTHENTICATION
 */
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  const isAuthenticated = useIsAuthenticated();

  return useMutation({
    mutationFn: (itemId: string) => {
      if (!isAuthenticated) {
        throw new Error('Authentication required');
      }
      return cartApi.removeCartItem(itemId);
    },
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.items() });
      const previous = queryClient.getQueryData<CartItem[]>(cartKeys.items());
      
      queryClient.setQueryData<CartItem[]>(cartKeys.items(), (old) =>
        old?.filter((item) => item.cartId !== itemId)
      );
      
      return { previous };
    },
    onError: (error: any, __, context) => {
      // If 404, item is already gone, so don't rollback
      if (error?.response?.status === 404) {
        queryClient.invalidateQueries({ queryKey: cartKeys.items() });
        return;
      }

      if (context?.previous) {
        queryClient.setQueryData(cartKeys.items(), context.previous);
      }
    },
    onSuccess: (serverItems) => {
      // Backend now returns updated cart, so update cache directly
      if (serverItems) {
        queryClient.setQueryData(cartKeys.items(), serverItems);
      }
    },
  });
};



/**
 * Clear cart - REQUIRES AUTHENTICATION
 */
export const useClearCart = () => {
  const queryClient = useQueryClient();
  const isAuthenticated = useIsAuthenticated();

  return useMutation({
    mutationFn: () => {
      if (!isAuthenticated) {
        throw new Error('Authentication required');
      }
      return cartApi.clearCart();
    },
    onSuccess: () => {
      queryClient.setQueryData(cartKeys.items(), []);
    },
  });
};
