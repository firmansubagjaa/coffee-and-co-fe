/**
 * Cart API - Shopping cart endpoints
 * 
 * Uses hybrid strategy:
 * - Guest users: LocalStorage only
 * - Authenticated users: Server sync with LocalStorage backup
 */

import apiClient, { ApiResponse } from './client';
import { CartItem, Product, ProductVariant } from '@/types';

// ============================================
// TYPES
// ============================================

interface BackendCartItem {
  id: string;
  product_id: string;
  variant_id: string | null;
  size_id: string | null;
  grind_option_id: string | null;
  quantity: number;
  product: {
    id: string;
    name: string;
    description: string | null;
    base_price: string;
    category: string;
    rating: string | null;
    images?: { url: string; is_primary: boolean }[];
  };
  variant?: { id: string; name: string; price_adjustment: string } | null;
  size?: { id: string; size: string; price_adjustment: string } | null;
  grind_option?: { id: string; grind_type: string } | null;
}

interface BackendCart {
  id: string;
  user_id: string;
  items: BackendCartItem[];
}

export interface AddToCartRequest {
  productId: string;
  variantId?: string;
  sizeId?: string;
  grindOptionId?: string;
  quantity: number;
}

// ============================================
// TRANSFORMERS
// ============================================

const transformCartItem = (item: BackendCartItem): CartItem => {
  const product = item.product;
  const basePrice = parseFloat(product.base_price);
  const variantAdjust = item.variant ? parseFloat(item.variant.price_adjustment) : 0;
  const sizeAdjust = item.size ? parseFloat(item.size.price_adjustment) : 0;

  return {
    id: product.id,
    cartId: item.id,
    name: product.name,
    description: product.description ?? '',
    price: basePrice + variantAdjust + sizeAdjust,
    category: product.category as 'coffee' | 'pastry' | 'merch',
    rating: product.rating ? parseFloat(product.rating) : 0,
    image: product.images?.find((i) => i.is_primary)?.url ?? product.images?.[0]?.url ?? '/placeholder-product.jpg',
    quantity: item.quantity,
    selectedVariant: item.variant
      ? {
          id: item.variant.id,
          name: item.variant.name,
          price: parseFloat(item.variant.price_adjustment),
          stock: 0,
          sku: '',
        }
      : undefined,
    selectedSize: item.size?.size,
    selectedGrind: item.grind_option?.grind_type,
  };
};

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Get user's cart
 */
export const getCart = async (): Promise<CartItem[]> => {
  const response = await apiClient.get<ApiResponse<BackendCart>>('/cart');
  
  if (!response.data?.data?.items) {
    console.warn('Backend returned unexpected cart structure:', response.data);
    return [];
  }
  
  return response.data.data.items.map(transformCartItem);
};

/**
 * Add item to cart
 */
export const addToCart = async (data: AddToCartRequest): Promise<CartItem[]> => {
  const response = await apiClient.post<ApiResponse<BackendCart>>('/cart/items', data);
  
  // Safe navigation - handle case where backend returns empty/malformed response
  if (!response.data?.data?.items) {
    console.warn('Backend returned unexpected cart structure:', response.data);
    return [];
  }
  
  return response.data.data.items.map(transformCartItem);
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (itemId: string, quantity: number): Promise<CartItem[]> => {
  const response = await apiClient.patch<ApiResponse<BackendCart>>(`/cart/items/${itemId}`, {  // ✅ Fixed: use PATCH
    quantity,
  });
  return response.data.data.items.map(transformCartItem);
};

/**
 * Remove item from cart
 */
export const removeCartItem = async (itemId: string): Promise<CartItem[]> => {
  const response = await apiClient.delete<ApiResponse<BackendCart>>(`/cart/items/${itemId}`);
  return response.data.data.items.map(transformCartItem);
};

/**
 * Clear entire cart
 */
export const clearCart = async (): Promise<void> => {
  await apiClient.delete('/cart');
};

/**
 * Sync local cart to server (on login)
 */
export const syncCartToServer = async (localItems: CartItem[]): Promise<CartItem[]> => {
  // Convert local cart items to API format
  const items: AddToCartRequest[] = localItems.map((item) => ({
    productId: item.id,
    variantId: item.selectedVariant?.id,
    quantity: item.quantity,
  }));

  // Send batch sync request
  const response = await apiClient.post<ApiResponse<BackendCart>>('/cart/sync', { items });
  return response.data.data.items.map(transformCartItem);
};
