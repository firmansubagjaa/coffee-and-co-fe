
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order } from '@/types';

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
}

// Initial Mock Data to populate the history view if empty
const INITIAL_MOCK_ORDERS: Order[] = [
  {
    id: '#3985839',
    userId: '1',
    status: 'In process',
    date: '24.05.2024',
    location: 'France, Avenn 50/495',
    total: 45.50,
    items: [
        { id: '1', cartId: 'c1', name: 'Espresso Romano', quantity: 1, image: 'https://picsum.photos/id/1060/200/200', price: 3.50, description: '', category: 'coffee', rating: 4.8 },
        { id: '2', cartId: 'c2', name: 'Croissant', quantity: 2, image: 'https://picsum.photos/id/431/200/200', price: 3.00, description: '', category: 'pastry', rating: 4.7 }
    ],
    timeline: [
      { label: 'Depart', date: '24.05.2024', status: 'completed' },
      { label: 'Shipped', date: '26.05.2024', status: 'current' },
      { label: 'Delivered', date: 'Expected 28.05', status: 'pending' },
    ]
  },
  {
    id: '#3985840',
    userId: '1',
    status: 'Delivered',
    date: '20.05.2024',
    location: 'France, Avenn 50/495',
    total: 12.75,
    items: [
        { id: '3', cartId: 'c3', name: 'Caramel Macchiato', quantity: 1, image: 'https://picsum.photos/id/312/200/200', price: 4.75, description: '', category: 'coffee', rating: 4.8 },
    ],
    timeline: [
      { label: 'Depart', date: '20.05.2024', status: 'completed' },
      { label: 'Shipped', date: '21.05.2024', status: 'completed' },
      { label: 'Delivered', date: '22.05.2024', status: 'completed' },
    ]
  }
];

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: INITIAL_MOCK_ORDERS,
      addOrder: (order) => set((state) => ({ 
        orders: [order, ...state.orders] 
      })),
    }),
    {
      name: 'orders-storage',
    }
  )
);
