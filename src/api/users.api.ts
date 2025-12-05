/**
 * Users API - User profile management endpoints
 */

import apiClient, { ApiResponse } from './client';
import { transformUser, BackendUser } from './transformers';
import { User } from '@/types';

// ============================================
// TYPES
// ============================================

export interface UpdateProfileRequest {
  fullName?: string;
  mobile?: string;
  address?: string;
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Update user profile
 */
export const updateProfile = async (data: UpdateProfileRequest): Promise<User> => {
  const response = await apiClient.put<ApiResponse<BackendUser>>('/users/profile', data);
  return transformUser(response.data.data);
};
