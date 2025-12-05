import { create } from 'zustand';
import { CartItem, CheckoutDetails } from '@/types';

interface CartState {
  isOpen: boolean;
  toggleCart: () => void;
  checkoutDetails: CheckoutDetails | null;
  setCheckoutDetails: (details: CheckoutDetails) => void;
  
  // Note: Items managed by backend (via useCart hook)
  // This store only handles UI state now
}

/**
 * Cart Store - UI State Only
 * Cart items are managed by backend via useCart hook
 * This store only manages drawer open/close state and checkout form data
 */
export const useCartStore = create<CartState>((set) => ({
  isOpen: false,
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  checkoutDetails: null,
  setCheckoutDetails: (details) => set({ checkoutDetails: details }),
}));
