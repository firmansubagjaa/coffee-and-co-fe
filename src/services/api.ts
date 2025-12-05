/**
 * @deprecated This file contains legacy mock data.
 * 
 * Use the new API layer instead:
 *   import { useProducts, useProduct } from '@/api';
 * 
 * These exports are kept for backward compatibility during migration.
 * They will be removed once all components are updated.
 */

import { Product } from '@/types';

// Legacy warning
const logDeprecationWarning = (functionName: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `[DEPRECATED] ${functionName}() is deprecated. ` +
      `Use React Query hooks from '@/api' instead.`
    );
  }
};

// Temporary fallback until all components migrate
// These will make real API calls via the new layer
import * as productsApi from '@/api/products.api';

export const fetchProducts = async (): Promise<Product[]> => {
  logDeprecationWarning('fetchProducts');
  const result = await productsApi.getProducts();
  return result.products;
};

export const fetchProductById = async (id: string): Promise<Product | undefined> => {
  logDeprecationWarning('fetchProductById');
  try {
    return await productsApi.getProductById(id);
  } catch {
    return undefined;
  }
};

export const fetchRelatedProducts = async (currentId: string): Promise<Product[]> => {
  logDeprecationWarning('fetchRelatedProducts');
  return await productsApi.getRelatedProducts(currentId, 3);
};

// Admin CRUD - deprecated, use useMutation hooks instead
export const addProduct = async (product: Omit<Product, 'id' | 'rating'>): Promise<Product> => {
  logDeprecationWarning('addProduct');
  return await productsApi.createProduct({
    name: product.name,
    description: product.description,
    category: product.category,
    basePrice: product.price,
    origin: product.origin,
    roastLevel: product.roastLevel,
    tastingNotes: product.tastingNotes,
  });
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | undefined> => {
  logDeprecationWarning('updateProduct');
  try {
    return await productsApi.updateProduct(id, {
      name: updates.name,
      description: updates.description,
      category: updates.category,
      basePrice: updates.price,
    });
  } catch {
    return undefined;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  logDeprecationWarning('deleteProduct');
  try {
    await productsApi.deleteProduct(id);
    return true;
  } catch {
    return false;
  }
};
