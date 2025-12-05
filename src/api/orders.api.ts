/**
 * Orders API - Order management endpoints
 */

import apiClient, { ApiResponse } from './client';
import { transformOrder, BackendOrder } from './transformers';
import { Order, CartItem, PaymentMethod } from '@/types';

// ============================================
// TYPES
// ============================================

export interface CreateOrderRequest {
  items: {
    productId: string;
    variantId?: string;
    sizeId?: string;
    grindOptionId?: string;
    quantity: number;
  }[];
  location?: string;
  paymentMethod: PaymentMethod;
  deliveryAddress?: string;
  deliveryNote?: string;
}

interface OrdersResponse {
  orders: BackendOrder[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Create new order
 */
export const createOrder = async (data: CreateOrderRequest): Promise<Order> => {
  const response = await apiClient.post<ApiResponse<BackendOrder>>('/orders', data);
  return transformOrder(response.data.data);
};

/**
 * Get user's order history
 */
export const getOrders = async (params: { page?: number; limit?: number } = {}): Promise<{
  orders: Order[];
  meta: OrdersResponse['meta'];
}> => {
  const response = await apiClient.get<ApiResponse<BackendOrder[]>>('/orders', {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    },
  });

  return {
    orders: response.data.data.map(transformOrder),
    meta: response.data.meta ?? {
      total: response.data.data.length,
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      totalPages: 1,
    },
  };
};

/**
 * Get user's my orders (customer endpoint)
 */
export const getMyOrders = async (params: { page?: number; limit?: number } = {}): Promise<{
  orders: Order[];
  meta: OrdersResponse['meta'];
}> => {
  const response = await apiClient.get<ApiResponse<BackendOrder[]>>('/orders/my-orders', {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    },
  });

  return {
    orders: response.data.data.map(transformOrder),
    meta: response.data.meta ?? {
      total: response.data.data.length,
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      totalPages: 1,
    },
  };
};



/**
 * Get single order by ID
 */
export const getOrderById = async (id: string): Promise<Order> => {
  const response = await apiClient.get<ApiResponse<BackendOrder>>(`/orders/${id}`);
  return transformOrder(response.data.data);
};

/**
 * Get active orders (for barista KDS)
 */
export const getActiveOrders = async (): Promise<Order[]> => {
  const response = await apiClient.get<ApiResponse<BackendOrder[]>>('/orders/active');
  return response.data.data.map(transformOrder);
};

/**
 * Update order status (barista/admin)
 */
export const updateOrderStatus = async (
  id: string,
  status: 'preparing' | 'ready' | 'completed' | 'cancelled'
): Promise<Order> => {
  const response = await apiClient.patch<ApiResponse<BackendOrder>>(`/orders/${id}/status`, {
    status,
  });
  return transformOrder(response.data.data);
};

/**
 * Helper: Create order from cart items
 */
export const createOrderFromCart = async (
  cartItems: CartItem[],
  details: {
    location?: string;
    paymentMethod: PaymentMethod;
    deliveryAddress?: string;
    deliveryNote?: string;
  }
): Promise<Order> => {
  const orderData: CreateOrderRequest = {
    items: cartItems.map((item) => ({
      productId: item.id,
      variantId: item.selectedVariant?.id,
      quantity: item.quantity,
    })),
    ...details,
  };

  return createOrder(orderData);
};
