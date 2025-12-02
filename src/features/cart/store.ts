
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, CheckoutDetails } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  checkoutDetails: CheckoutDetails | null;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
  total: () => number;
  setCheckoutDetails: (details: CheckoutDetails) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      checkoutDetails: null,
      addToCart: (product) => set((state) => {
        const existing = state.items.find(item => item.id === product.id);
        if (existing) {
          return {
            items: state.items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          };
        }
        return { items: [...state.items, { ...product, quantity: 1, cartId: `${product.id}-${Date.now()}` }] };
      }),
      removeFromCart: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
        ).filter(item => item.quantity > 0)
      })),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      clearCart: () => set({ items: [], checkoutDetails: null }),
      total: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      },
      setCheckoutDetails: (details) => set({ checkoutDetails: details }),
    }),
    {
      name: 'cart-storage',
      // Only persist cart items, mostly
      partialize: (state) => ({ items: state.items, checkoutDetails: state.checkoutDetails }),
    }
  )
);
