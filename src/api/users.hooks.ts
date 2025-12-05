/**
 * Users Hooks - React Query hooks for user operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as usersApi from './users.api';
import { authKeys } from './auth.hooks';
import { useAuthStore } from '@/features/auth/store';

/**
 * Update profile mutation
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: (updatedUser) => {
      // Update React Query cache
      queryClient.setQueryData(authKeys.profile(), updatedUser);
      
      // Update Zustand store
      updateUser(updatedUser);
      
      // Invalidate to refetch
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
};
