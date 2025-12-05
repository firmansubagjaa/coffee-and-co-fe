/**
 * Dashboard API - Admin analytics and statistics endpoints
 */

import apiClient, { ApiResponse } from "./client";

// ============================================
// TYPES
// ============================================

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  orderStatusDistribution: {
    pending: number;
    preparing: number;
    ready: number;
    completed: number;
    cancelled: number;
  };
}

export interface FinanceData {
  revenue: {
    total: number;
    growth: number;
  };
  orders: {
    total: number;
    growth: number;
  };
  averageOrderValue: {
    value: number;
    growth: number;
  };
  topProducts: Array<{
    id: string;
    name: string;
    revenue: number;
    quantity: number;
  }>;
  revenueByDate: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

export interface CustomerSegment {
  segment: "VIP" | "Regular" | "New" | "At Risk";
  count: number;
  totalRevenue: number;
  averageOrderValue: number;
  averageOrders: number;
  description: string;
}

export interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    averageOrderValue: number;
  };
  trends: {
    daily: Array<{
      date: string;
      revenue: number;
      orders: number;
    }>;
    weekly: Array<{
      week: string;
      revenue: number;
      orders: number;
    }>;
    monthly: Array<{
      month: string;
      revenue: number;
      orders: number;
    }>;
  };
  topProducts: Array<{
    id: string;
    name: string;
    category: string;
    revenue: number;
    quantity: number;
    growth: number;
  }>;
  customerMetrics: {
    newCustomers: number;
    returningCustomers: number;
    churnRate: number;
    retentionRate: number;
  };
}

export interface DashboardParams {
  startDate?: string;
  endDate?: string;
  groupBy?: "day" | "week" | "month";
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Get dashboard statistics (Admin only)
 */
export const getDashboardStats = async (
  params: DashboardParams = {}
): Promise<DashboardStats> => {
  const response = await apiClient.get<ApiResponse<any>>("/dashboard/stats", {
    params,
  });

  // Map backend response to frontend expected format
  const backendData = response.data.data;
  return {
    totalRevenue: backendData.revenue?.total || 0,
    totalOrders: backendData.orders?.total || 0,
    totalCustomers: backendData.users?.active || 0,
    averageOrderValue: backendData.revenue?.average || 0,
    revenueGrowth: 0, // Backend doesn't provide this yet
    ordersGrowth: 0, // Backend doesn't provide this yet
    customersGrowth: 0, // Backend doesn't provide this yet
    orderStatusDistribution: {
      pending: backendData.orders?.pending || 0,
      preparing: backendData.orders?.preparing || 0,
      ready: backendData.orders?.ready || 0,
      completed: backendData.orders?.completed || 0,
      cancelled: backendData.orders?.cancelled || 0,
    },
  };
};

/**
 * Get finance data with trends (Admin only)
 */
export const getFinanceData = async (
  params: DashboardParams = {}
): Promise<FinanceData> => {
  const response = await apiClient.get<ApiResponse<FinanceData>>(
    "/dashboard/finance",
    {
      params: {
        ...params,
        groupBy: params.groupBy ?? "day",
      },
    }
  );
  return response.data.data;
};

/**
 * Get customer segments (Admin only)
 */
export const getCustomerSegments = async (
  params: DashboardParams = {}
): Promise<CustomerSegment[]> => {
  const response = await apiClient.get<ApiResponse<CustomerSegment[]>>(
    "/dashboard/customers/segments",
    {
      params,
    }
  );
  return response.data.data;
};

/**
 * Get comprehensive analytics (Admin/Analyst only)
 */
export const getAnalytics = async (
  params: DashboardParams = {}
): Promise<AnalyticsData> => {
  const response = await apiClient.get<ApiResponse<AnalyticsData>>(
    "/dashboard/analytics",
    {
      params,
    }
  );
  return response.data.data;
};

/**
 * Get recent orders for dashboard (Admin only)
 */
export const getRecentOrders = async (limit: number = 10) => {
  const response = await apiClient.get("/orders", {
    params: { limit, page: 1 },
  });
  return response.data.data;
};

/**
 * Get top selling products (Admin only)
 */
export const getTopProducts = async (
  limit: number = 10,
  params: DashboardParams = {}
) => {
  try {
    // Get from stats endpoint which has topProducts
    const response = await apiClient.get<ApiResponse<any>>("/dashboard/stats", {
      params,
    });

    const backendData = response.data.data;

    // Backend returns topProducts as { byVolume: [], byRevenue: [] }
    const topProductsByRevenue = backendData.topProducts?.byRevenue || [];
    const topProductsByVolume = backendData.topProducts?.byVolume || [];

    // Prefer byRevenue, fallback to byVolume
    const topProducts =
      topProductsByRevenue.length > 0
        ? topProductsByRevenue
        : topProductsByVolume;

    return topProducts.slice(0, limit);
  } catch (error) {
    console.error("Error fetching top products:", error);
    return [];
  }
};
