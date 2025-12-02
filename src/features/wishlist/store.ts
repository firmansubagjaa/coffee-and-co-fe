import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface WishlistState {
  items: Product[];
  addWishlist: (product: Product) => void;
  removeWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addWishlist: (product) => set((state) => ({ 
        items: [...state.items, product] 
      })),
      removeWishlist: (id) => set((state) => ({ 
        items: state.items.filter(item => item.id !== id) 
      })),
      isInWishlist: (id) => get().items.some(item => item.id === id),
      toggleWishlist: (product) => {
        const { isInWishlist, addWishlist, removeWishlist } = get();
        if (isInWishlist(product.id)) {
          removeWishlist(product.id);
        } else {
          addWishlist(product);
        }
      }
    }),
    {
      name: 'wishlist-storage',
    }
  )
);