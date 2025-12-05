/**
 * Favorites API - User favorites endpoints
 */

import apiClient, { ApiResponse } from './client';
import { transformProducts, BackendProduct } from './transformers';
import { Product } from '@/types';

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Get user's favorites
 */
export const getFavorites = async (): Promise<Product[]> => {
  const response = await apiClient.get<ApiResponse<BackendProduct[]>>('/favorites');
  return transformProducts(response.data.data);
};

/**
 * Add product to favorites
 */
export const addFavorite = async (productId: string): Promise<void> => {
  await apiClient.post('/favorites', { productId });
};

/**
 * Remove product from favorites
 */
export const removeFavorite = async (productId: string): Promise<void> => {
  await apiClient.delete(`/favorites/${productId}`);
};

/**
 * Toggle favorite status
 */
export const toggleFavorite = async (productId: string, isFavorited: boolean): Promise<void> => {
  if (isFavorited) {
    await removeFavorite(productId);
  } else {
    await addFavorite(productId);
  }
};
