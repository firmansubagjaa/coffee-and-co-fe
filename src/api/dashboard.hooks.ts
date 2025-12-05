/**
 * Dashboard Hooks - React Query hooks for admin dashboard
 */

import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getFinanceData,
  getCustomerSegments,
  getAnalytics,
  getRecentOrders,
  getTopProducts,
  type DashboardParams,
} from "./dashboard.api";

// ============================================
// QUERY KEYS
// ============================================

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: (params: DashboardParams) =>
    [...dashboardKeys.all, "stats", params] as const,
  finance: (params: DashboardParams) =>
    [...dashboardKeys.all, "finance", params] as const,
  segments: (params: DashboardParams) =>
    [...dashboardKeys.all, "segments", params] as const,
  analytics: (params: DashboardParams) =>
    [...dashboardKeys.all, "analytics", params] as const,
  recentOrders: (limit: number) =>
    [...dashboardKeys.all, "recent-orders", limit] as const,
  topProducts: (limit: number, params: DashboardParams) =>
    [...dashboardKeys.all, "top-products", limit, params] as const,
};

// ============================================
// QUERIES
// ============================================

/**
 * Get dashboard statistics
 */
export const useDashboardStats = (params: DashboardParams = {}) => {
  return useQuery({
    queryKey: dashboardKeys.stats(params),
    queryFn: () => getDashboardStats(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

/**
 * Get finance data with trends
 */
export const useFinanceData = (params: DashboardParams = {}) => {
  return useQuery({
    queryKey: dashboardKeys.finance(params),
    queryFn: () => getFinanceData(params),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
};

/**
 * Get customer segments
 */
export const useCustomerSegments = (params: DashboardParams = {}) => {
  return useQuery({
    queryKey: dashboardKeys.segments(params),
    queryFn: () => getCustomerSegments(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Get comprehensive analytics
 */
export const useAnalytics = (params: DashboardParams = {}) => {
  return useQuery({
    queryKey: dashboardKeys.analytics(params),
    queryFn: () => getAnalytics(params),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
};

/**
 * Get recent orders for dashboard
 */
export const useRecentOrders = (limit: number = 10) => {
  return useQuery({
    queryKey: dashboardKeys.recentOrders(limit),
    queryFn: () => getRecentOrders(limit),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
};

/**
 * Get top selling products
 */
export const useTopProducts = (
  limit: number = 10,
  params: DashboardParams = {}
) => {
  return useQuery({
    queryKey: dashboardKeys.topProducts(limit, params),
    queryFn: () => getTopProducts(limit, params),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Combined hook for dashboard home page
 */
export const useDashboardHome = (params: DashboardParams = {}) => {
  const stats = useDashboardStats(params);
  const recentOrders = useRecentOrders(5);
  const topProducts = useTopProducts(5, params);

  return {
    stats,
    recentOrders,
    topProducts,
    isLoading:
      stats.isLoading || recentOrders.isLoading || topProducts.isLoading,
    isError: stats.isError || recentOrders.isError || topProducts.isError,
  };
};
