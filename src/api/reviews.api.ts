/**
 * Reviews API - Product review endpoints
 */

import apiClient, { ApiResponse } from './client';
import { Review } from '@/types';

// ============================================
// TYPES
// ============================================

interface BackendReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
}

// ============================================
// TRANSFORMERS
// ============================================

const transformReview = (be: BackendReview): Review => ({
  id: be.id,
  productId: be.product_id,
  userId: be.user_id,
  rating: be.rating,
  comment: be.comment || '',
  createdAt: be.created_at,
  userName: be.user?.full_name || 'Anonymous',
  userAvatar: be.user?.avatar_url || undefined,
});

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Get reviews for a product
 */
export const getProductReviews = async (productId: string): Promise<Review[]> => {
  const response = await apiClient.get<ApiResponse<BackendReview[]>>(
    `/reviews/product/${productId}`  // ✅ Fixed: match backend route
  );
  return response.data.data.map(transformReview);
};

/**
 * Create a review
 */
export const createReview = async (data: CreateReviewRequest): Promise<Review> => {
  const response = await apiClient.post<ApiResponse<BackendReview>>('/reviews', data);
  return transformReview(response.data.data);
};

/**
 * Update own review
 */
export const updateReview = async (
  reviewId: string,
  data: UpdateReviewRequest
): Promise<Review> => {
  const response = await apiClient.patch<ApiResponse<BackendReview>>(
    `/reviews/${reviewId}`,
    data
  );
  return transformReview(response.data.data);
};

/**
 * Delete own review
 */
export const deleteReview = async (reviewId: string): Promise<void> => {
  await apiClient.delete(`/reviews/${reviewId}`);
};
