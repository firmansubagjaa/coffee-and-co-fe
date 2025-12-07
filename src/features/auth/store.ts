/**
 * Auth Store - Zustand store for authentication state
 *
 * This store is now simplified to only manage STATE.
 * All API calls are handled by React Query hooks in auth.hooks.ts
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Backward compatibility
  resetEmail: string | null;
  tempRegistrationEmail: string | null;

  // Actions (called by React Query hooks)
  setUser: (user: User, accessToken: string) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
  setResetEmail: (email: string) => void;
  clearResetEmail: () => void;
  setTempRegistrationEmail: (email: string) => void;
  clearTempEmail: () => void;
  setLoading: (loading: boolean) => void;

  // Backward compatibility - async method for components not yet migrated
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      resetEmail: null,
      tempRegistrationEmail: null,

      // Set user after login/register
      setUser: (user, accessToken) =>
        set({
          user,
          accessToken,
          isAuthenticated: true,
        }),

      // Update user profile (sync)
      updateUser: (data) =>
        set((state) => {
          if (!state.user) return state;

          const updatedUser = { ...state.user, ...data };

          // Reconstruct full name if first or last name changes
          if (data.firstName || data.lastName) {
            updatedUser.name = `${updatedUser.firstName} ${updatedUser.lastName}`;
          }

          return { user: updatedUser };
        }),

      // Logout - clear all auth state AND cart
      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          resetEmail: null,
          tempRegistrationEmail: null,
        });

        // Cart is now managed by backend and will be cleared on logout automatically
      },

      // Password reset flow
      setResetEmail: (email) => set({ resetEmail: email }),
      clearResetEmail: () => set({ resetEmail: null }),

      // Registration OTP flow
      setTempRegistrationEmail: (email) =>
        set({ tempRegistrationEmail: email }),
      clearTempEmail: () => set({ tempRegistrationEmail: null }),

      // Loading state
      setLoading: (loading) => set({ isLoading: loading }),

      // Backward compatibility - updateProfile with loading state
      // TODO: Migrate components to use React Query useMutation
      updateProfile: async (data) => {
        set({ isLoading: true });
        try {
          // For now, just update locally
          // When API is connected, use: await usersApi.updateProfile(data)
          set((state) => {
            if (!state.user) return { isLoading: false };

            const updatedUser = { ...state.user, ...data };
            if (data.firstName || data.lastName) {
              updatedUser.name = `${updatedUser.firstName} ${updatedUser.lastName}`;
            }

            return { user: updatedUser, isLoading: false };
          });
        } catch {
          set({ isLoading: false });
          throw new Error("Failed to update profile");
        }
      },
    }),
    {
      name: "auth-storage",
      // Persist user info and accessToken (short-lived, safe to store)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
      }),
    }
  )
);

// Selectors for convenience
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useUserRole = () => useAuthStore((state) => state.user?.role);
