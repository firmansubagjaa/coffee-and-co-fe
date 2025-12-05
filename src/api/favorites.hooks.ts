/**
 * Favorites Hooks - React Query hooks for favorites
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as favoritesApi from './favorites.api';
import { productKeys } from './products.hooks';
import { useIsAuthenticated } from '@/features/auth/store';

// Query Keys
export const favoritesKeys = {
  all: ['favorites'] as const,
  list: () => [...favoritesKeys.all, 'list'] as const,
};

/**
 * Get user's favorites
 */
export const useFavorites = () => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: favoritesKeys.list(),
    queryFn: favoritesApi.getFavorites,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Toggle favorite mutation with optimistic update
 */
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, isFavorited }: { productId: string; isFavorited: boolean }) =>
      favoritesApi.toggleFavorite(productId, isFavorited),

    onMutate: async ({ productId, isFavorited }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: favoritesKeys.list() });

      // Snapshot the previous value
      const previousFavorites = queryClient.getQueryData(favoritesKeys.list());

      // Optimistically update favorites list
      if (isFavorited) {
        // Remove from list
        queryClient.setQueryData(favoritesKeys.list(), (old: unknown[] | undefined) =>
          old?.filter((p: { id: string }) => p.id !== productId)
        );
      }

      return { previousFavorites };
    },

    onError: (_, __, context) => {
      // Rollback on error
      if (context?.previousFavorites) {
        queryClient.setQueryData(favoritesKeys.list(), context.previousFavorites);
      }
    },

    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: favoritesKeys.list() });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

/**
 * Check if product is favorited
 */
export const useIsFavorited = (productId: string): boolean => {
  const { data: favorites } = useFavorites();
  return favorites?.some((p) => p.id === productId) ?? false;
};
