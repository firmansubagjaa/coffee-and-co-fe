/**
 * API Layer - Barrel Exports
 *
 * This file re-exports all API functions and hooks for easy importing.
 *
 * Usage:
 *   import { useProducts, useLogin, apiClient } from '@/api';
 */

// Client
export { default as apiClient } from "./client";
export { setAccessToken, getAccessToken, handleApiError } from "./client";
export type { ApiResponse, ApiError } from "./client";

// Auth
export * from "./auth.api";
export * from "./auth.hooks";

// Products
export * from "./products.api";
export * from "./products.hooks";

// Favorites
export * from "./favorites.api";
export * from "./favorites.hooks";

// Cart
export * from "./cart.api";
export * from "./cart.hooks";

// Orders
export * from "./orders.api";
export * from "./orders.hooks";

// Users
export * from "./users.api";
export * from "./users.hooks";

// Reviews
export * from "./reviews.api";
export * from "./reviews.hooks";

// Stores
export * from "./stores.api";
export * from "./stores.hooks";

// Dashboard
export * from "./dashboard.api";
export * from "./dashboard.hooks";

// Inventory
export * from "./inventory.api";
export * from "./inventory.hooks";

// CMS (Jobs & Applications)
export * from "./cms.api";
export * from "./cms.hooks";

// Transformers (for advanced use cases)
export * from "./transformers";
