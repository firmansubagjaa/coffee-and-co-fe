
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Role } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  resetEmail: string | null; // Track email during reset flow
  login: (email: string) => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  verifyOTP: (code: string) => Promise<boolean>;
  resetPassword: (password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      resetEmail: null,
      login: async (email) => {
        set({ isLoading: true });
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Mock Role Assignment based on email for demonstration
        let role: Role = 'customer';
        if (email.includes('admin')) role = 'admin';
        if (email.includes('barista')) role = 'barista';
        if (email.includes('super')) role = 'superadmin';

        const nameParts = email.split('@')[0].split('.');
        const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : 'User';
        const lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : 'Name';

        set({
          isLoading: false,
          isAuthenticated: true,
          user: {
            id: '1',
            name: `${firstName} ${lastName}`,
            firstName: firstName,
            lastName: lastName,
            email: email,
            role: role,
            streak: 3,
            lastVisit: new Date().toISOString(),
            mobile: '+1 234 567 890',
            address: '123 Coffee Lane',
            deliveryNote: 'Leave at front door',
            avatarColor: '795548' // Default Coffee color
          },
        });
      },
      register: async (name, email) => {
        set({ isLoading: true });
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        const nameParts = name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';

        set({
          isLoading: false,
          isAuthenticated: true,
          user: {
            id: '2',
            name: name,
            firstName,
            lastName,
            email: email,
            role: 'customer',
            streak: 0,
            lastVisit: new Date().toISOString(),
            mobile: '',
            address: '',
            deliveryNote: '',
            avatarColor: '795548'
          },
        });
      },
      logout: () => set({ user: null, isAuthenticated: false, resetEmail: null }),
      updateProfile: async (data) => {
        set({ isLoading: true });
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        set((state) => {
            if (!state.user) return { isLoading: false };
            const updatedUser = { ...state.user, ...data };
            
            // Reconstruct full name if first or last name changes
            if (data.firstName || data.lastName) {
                updatedUser.name = `${updatedUser.firstName} ${updatedUser.lastName}`;
            }

            return {
                isLoading: false,
                user: updatedUser
            };
        });
      },
      // --- Password Reset Flow ---
      requestPasswordReset: async (email) => {
        set({ isLoading: true });
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        // Security best practice: Always return success to UI to prevent email enumeration
        set({ isLoading: false, resetEmail: email });
      },
      verifyOTP: async (code) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        set({ isLoading: false });
        // Mock validation: "123456" is the magic code
        return code === "123456"; 
      },
      resetPassword: async (password) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 1500));
        set({ isLoading: false, resetEmail: null });
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);
