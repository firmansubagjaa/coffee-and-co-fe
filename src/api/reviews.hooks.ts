/**
 * Reviews Hooks - React Query hooks for reviews
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as reviewsApi from './reviews.api';

// Query Keys
export const reviewKeys = {
  all: ['reviews'] as const,
  product: (productId: string) => [...reviewKeys.all, productId] as const,
};

/**
 * Get reviews for a product
 */
export const useProductReviews = (
  productId: string,
  page: number = 1,
  limit: number = 5
) => {
  return useQuery({
    queryKey: [...reviewKeys.product(productId), page, limit],
    queryFn: () => reviewsApi.getProductReviews(productId), // Note: API needs update to accept params
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Create review mutation
 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewsApi.createReview,
    onSuccess: (_, variables) => {
      // Invalidate product reviews to refetch
      queryClient.invalidateQueries({ 
        queryKey: reviewKeys.product(variables.productId) 
      });
      toast.success("Review submitted successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to submit review", {
        description: error.message || "Please try again later",
      });
    },
  });
};

/**
 * Update review mutation
 */
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      data,
    }: {
      reviewId: string;
      data: reviewsApi.UpdateReviewRequest;
    }) => reviewsApi.updateReview(reviewId, data),
    onSuccess: (_, variables) => {
      // Invalidate specific review and list
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      toast.success("Review updated successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to update review", {
        description: error.message || "Please try again later",
      });
    },
  });
};

/**
 * Delete a review
 */
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => reviewsApi.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      toast.success("Review deleted successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to delete review", {
        description: error.message || "Please try again later",
      });
    },
  });
};
