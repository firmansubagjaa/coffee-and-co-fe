/**
 * Auth API - Authentication endpoints
 */

import apiClient, { ApiResponse, ApiError, setAccessToken, handleApiError } from './client';
import { transformUser, BackendUser } from './transformers';
import { User } from '@/types';
import { AxiosError } from 'axios';

// ============================================
// TYPES
// ============================================

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  mobile?: string;
}

interface VerifyOtpRequest {
  email: string;
  otp: string;
}

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface AuthResponse {
  user: BackendUser;
  accessToken: string;
}

interface RegisterResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    isVerified: boolean;
  };
}

interface VerifyResetOtpResponse {
  resetToken: string;
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Register new user - requires OTP verification before login
 */
export const register = async (data: RegisterRequest): Promise<{ email: string }> => {
  const response = await apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', {
    email: data.email,
    password: data.password,
    fullName: data.fullName,
    mobile: data.mobile,
  });
  
  return { email: response.data.data.user.email };
};

/**
 * Verify OTP for email verification (after registration)
 * Returns user and accessToken on success
 */
export const verifyOtp = async (data: VerifyOtpRequest): Promise<{ user: User; accessToken: string }> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/verify-otp', data);
  
  const { accessToken, user: backendUser } = response.data.data;
  setAccessToken(accessToken);
  
  return {
    user: transformUser(backendUser),
    accessToken,
  };
};

/**
 * Resend OTP code
 */
export const resendOtp = async (email: string): Promise<void> => {
  await apiClient.post('/auth/resend-otp', { email });
};

/**
 * Login with email and password
 * Requires email to be verified first
 */
export const login = async (data: LoginRequest): Promise<{ user: User; accessToken: string }> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
  
  const { accessToken, user: backendUser } = response.data.data;
  setAccessToken(accessToken);
  
  return {
    user: transformUser(backendUser),
    accessToken,
  };
};

/**
 * Refresh access token using HTTP-only cookie
 */
export const refreshToken = async (): Promise<{ user: User; accessToken: string }> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh');
  
  const { accessToken, user: backendUser } = response.data.data;
  setAccessToken(accessToken);
  
  return {
    user: transformUser(backendUser),
    accessToken,
  };
};

/**
 * Logout - clears tokens
 */
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    setAccessToken(null);
  }
};

/**
 * Request password reset - sends OTP to email
 */
export const forgotPassword = async (email: string): Promise<void> => {
  await apiClient.post('/auth/forgot-password', { email });
};

/**
 * Verify reset OTP and get reset token
 */
export const verifyResetOtp = async (data: VerifyOtpRequest): Promise<{ resetToken: string }> => {
  const response = await apiClient.post<ApiResponse<VerifyResetOtpResponse>>('/auth/verify-reset-otp', data);
  return { resetToken: response.data.data.resetToken };
};

/**
 * Reset password with token from verifyResetOtp
 */
export const resetPassword = async (data: ResetPasswordRequest): Promise<void> => {
  await apiClient.post('/auth/reset-password', data);
};

/**
 * Change password for authenticated user
 */
export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  await apiClient.post('/auth/change-password', data);
};

/**
 * Get current user profile
 */
export const getProfile = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<BackendUser>>('/users/profile');
  return transformUser(response.data.data);
};

// ============================================
// ERROR HELPER
// ============================================

export const getAuthError = (error: unknown): string => {
  return handleApiError(error as AxiosError<ApiError>);
};
