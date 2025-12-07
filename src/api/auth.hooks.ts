/**
 * Auth Hooks - React Query hooks for authentication
 */

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import * as authApi from "./auth.api";
import { useAuthStore } from "@/features/auth/store";
// Cart sync removed - auth-only cart now, no guest cart to sync

// Query Keys
export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
};

/**
 * Login mutation
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      authApi.login(data),
    onSuccess: async (data) => {
      setUser(data.user, data.accessToken);
      queryClient.setQueryData(authKeys.profile(), data.user);

      // Cart will auto-fetch via useCart hook when isAuthenticated becomes true
      // No need to manually sync - auth-only cart architecture
    },
  });
};

/**
 * Register mutation
 */
export const useRegister = () => {
  const setTempEmail = useAuthStore((state) => state.setTempRegistrationEmail);

  return useMutation({
    mutationFn: (data: {
      email: string;
      password: string;
      fullName: string;
      mobile?: string;
    }) => authApi.register(data),
    onSuccess: (data) => {
      setTempEmail(data.email);
    },
  });
};

/**
 * Verify OTP mutation (registration)
 */
export const useVerifyOtp = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const clearTempEmail = useAuthStore((state) => state.clearTempEmail);

  return useMutation({
    mutationFn: (data: { email: string; otp: string }) =>
      authApi.verifyOtp(data),
    onSuccess: async (data) => {
      setUser(data.user, data.accessToken);
      clearTempEmail();
      queryClient.setQueryData(authKeys.profile(), data.user);

      // Cart will auto-fetch via useCart hook - auth-only architecture
    },
  });
};

/**
 * Resend OTP mutation
 */
export const useResendOtp = () => {
  return useMutation({
    mutationFn: ({
      email,
      type,
    }: {
      email: string;
      type?: "email_verification" | "password_reset";
    }) => authApi.resendOtp(email, type),
  });
};

/**
 * Logout mutation
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout();
      queryClient.clear(); // Clears all React Query cache including cart
    },
    onError: () => {
      // Even if API fails, clear local state
      logout();
      queryClient.clear();
    },
  });
};

/**
 * Forgot password mutation
 */
export const useForgotPassword = () => {
  const setResetEmail = useAuthStore((state) => state.setResetEmail);

  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: (_, email) => {
      setResetEmail(email);
    },
  });
};

/**
 * Verify reset OTP mutation
 */
export const useVerifyResetOtp = () => {
  return useMutation({
    mutationFn: (data: { email: string; otp: string }) =>
      authApi.verifyResetOtp(data),
  });
};

/**
 * Reset password mutation
 */
export const useResetPassword = () => {
  const clearResetEmail = useAuthStore((state) => state.clearResetEmail);

  return useMutation({
    mutationFn: (data: { token: string; newPassword: string }) =>
      authApi.resetPassword(data),
    onSuccess: () => {
      clearResetEmail();
    },
  });
};

/**
 * Change password mutation
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(data),
  });
};

/**
 * Get current user profile
 */
export const useProfile = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: authApi.getProfile,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Refresh token on app load
 */
export const useRefreshToken = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: () => authApi.refreshToken(),
    onSuccess: (data) => {
      setUser(data.user, data.accessToken);
    },
  });
};
