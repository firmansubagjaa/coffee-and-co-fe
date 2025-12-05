import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// API Base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for HTTP-only cookies (refresh token)
});

// Token storage (in-memory for security)
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// Request interceptor - attach access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Race condition prevention: track refresh promise
let refreshTokenPromise: Promise<string | null> | null = null;

// Response interceptor - handle 401 and refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 and not already retrying, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If refresh is already in progress, wait for it
        if (!refreshTokenPromise) {
          refreshTokenPromise = (async () => {
            try {
              // Attempt to refresh the token
              const response = await axios.post(
                `${API_BASE_URL}/auth/refresh`,
                {},
                { withCredentials: true }
              );

              const newToken = response.data?.data?.accessToken;
              if (newToken) {
                setAccessToken(newToken);
                
                // Sync with Zustand store if needed
                // Import dynamically to avoid circular dependency
                try {
                  const { useAuthStore } = await import('../features/auth/store');
                  const user = response.data?.data?.user;
                  if (user) {
                    // Transform backend user to frontend user format
                    const { transformUser } = await import('./transformers');
                    const transformedUser = transformUser(user);
                    useAuthStore.getState().updateUser(transformedUser);
                  }
                } catch (e) {
                  console.warn('Could not sync user with store:', e);
                }
                
                return newToken;
              }
              return null;
            } finally {
              refreshTokenPromise = null;
            }
          })();
        }

        const newToken = await refreshTokenPromise;
        
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear token and redirect to login
        setAccessToken(null);
        refreshTokenPromise = null;
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/auth/login')) {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Standard API Response types
export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  status: boolean;
  message: string;
  error?: {
    code: string;
    message: string;
    field?: string;
  };
}

// Error handler utility
export const handleApiError = (error: AxiosError<ApiError>): string => {
  if (error.response?.data?.error?.message) {
    return error.response.data.error.message;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export default apiClient;
