import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface FavoritesState {
  items: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      addFavorite: (product) => set((state) => ({ 
        items: [...state.items, product] 
      })),
      removeFavorite: (id) => set((state) => ({ 
        items: state.items.filter(item => item.id !== id) 
      })),
      isFavorite: (id) => get().items.some(item => item.id === id),
      toggleFavorite: (product) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        if (isFavorite(product.id)) {
          removeFavorite(product.id);
        } else {
          addFavorite(product);
        }
      }
    }),
    {
      name: 'favorites-storage',
    }
  )
);