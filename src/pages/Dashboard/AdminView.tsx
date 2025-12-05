import React, { useState } from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  AlertTriangle,
  Download,
  Calendar,
  ArrowRight,
  Target,
  CheckCircle2,
  Clock,
  ThumbsUp,
  AlertOctagon,
  ArrowUpRight,
  BrainCircuit,
} from "lucide-react";
import { CURRENCY } from "../../utils/constants";
import { Button } from "../../components/common/Button";
import { useDashboardHome } from "../../api/dashboard.hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { exportData } from "../../utils/export";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";

export const AdminView: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("this-month");
  const { t, language } = useLanguage();

  // Fetch dashboard data from API
  const { stats, recentOrders, topProducts, isLoading, isError } =
    useDashboardHome();

  // Debug logging
  console.log("Dashboard Debug:", {
    isLoading,
    isError,
    statsData: stats.data,
    statsError: stats.error,
    recentOrdersData: recentOrders.data,
    topProductsData: topProducts.data,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-600 mx-auto mb-4"></div>
          <p className="text-coffee-600 dark:text-coffee-400">
            {t("common.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    const errorMessage =
      stats.error?.message ||
      recentOrders.error?.message ||
      topProducts.error?.message ||
      "Unknown error";

    const errorDetails = [];
    if (stats.isError) errorDetails.push("Stats");
    if (recentOrders.isError) errorDetails.push("Orders");
    if (topProducts.isError) errorDetails.push("Products");

    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-error mx-auto mb-4" />
          <p className="text-coffee-600 dark:text-coffee-400">
            Failed to load dashboard data. Please try again.
          </p>
          {errorDetails.length > 0 && (
            <p className="text-xs text-coffee-400 mt-2">
              Failed components: {errorDetails.join(", ")}
            </p>
          )}
          <p className="text-xs text-error mt-1">{errorMessage}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
            variant="outline"
          >
            Reload
          </Button>
        </div>
      </div>
    );
  }

  if (!stats.data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-600 mx-auto mb-4"></div>
          <p className="text-coffee-600 dark:text-coffee-400">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  const statsData = stats.data;
  const recentOrdersData = recentOrders.data || [];
  const topProductsData = topProducts.data || [];

  // --- Strategy & OKR Data ---
  const STRATEGIC_GOALS = [
    {
      label: t("dashboard.admin.revenueTrend"),
      current: statsData?.totalRevenue || 0,
      target: (statsData?.totalRevenue || 0) * 1.3,
      unit: CURRENCY,
      color: "bg-success",
    },
    {
      label: t("dashboard.admin.goals.newCustomers"),
      current: statsData?.totalCustomers || 0,
      target: Math.round((statsData?.totalCustomers || 0) * 1.4),
      unit: "",
      color: "bg-info",
    },
    {
      label: t("dashboard.admin.goals.nps"),
      current: Math.round((statsData?.totalOrders || 0) * 0.85),
      target: statsData?.totalOrders || 0,
      unit: "",
      color: "bg-purple-500",
    },
  ];

  // --- Management by Exception (Alerts) ---
  const EXCEPTION_ALERTS = [
    {
      id: 1,
      type: t("dashboard.admin.alerts.inventory"),
      message: t("dashboard.admin.alerts.stockCritical"),
      priority: "critical" as const,
      time: "10 min ago",
    },
  ];

  // Top Products from API (replaces mock staff data)
  const displayTopProducts = topProductsData?.slice(0, 3) || [];

  const handleExport = (format: string) => {
    exportData(
      displayTopProducts,
      "performance_report",
      format as "csv" | "json"
    );
    toast.success(`Executive report exported as ${format.toUpperCase()}`);
  };

  const getProgressWidth = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* 1. Executive Summary Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-coffee-100 dark:bg-coffee-800 text-coffee-800 dark:text-coffee-200 text-xs font-bold uppercase tracking-widest border border-coffee-200 dark:border-coffee-700">
              {t("dashboard.admin.executiveView")}
            </span>
            <span className="text-xs text-coffee-400 dark:text-coffee-400 font-medium">
              {new Date().toLocaleDateString(
                language === "id" ? "id-ID" : "en-US",
                { weekday: "long", month: "long", day: "numeric" }
              )}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-white tracking-tight">
            {t("dashboard.admin.commandCenter")}
          </h1>
        </div>
        <div className="flex gap-3 items-center w-full md:w-auto">
          <Select onValueChange={handleExport}>
            <SelectTrigger className="w-[140px] bg-white dark:bg-coffee-900 h-11 rounded-full border border-coffee-200 dark:border-coffee-800">
              <div className="flex items-center gap-2 text-coffee-700 dark:text-coffee-200 font-medium">
                <Download className="w-4 h-4" />
                <span className="text-sm">{t("dashboard.admin.report")}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">
                {t("dashboard.admin.exportFormats.csv")}
              </SelectItem>
              <SelectItem value="json">
                {t("dashboard.admin.exportFormats.json")}
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="primary"
            className="gap-2 shadow-lg bg-yellow-400 hover:bg-yellow-500 text-coffee-900 h-11 px-6 w-full md:w-auto font-bold"
            onClick={() => navigate("/dashboard/analytics")}
          >
            <BrainCircuit className="w-4 h-4" /> {t("dashboard.admin.deepDive")}
          </Button>
        </div>
      </div>

      {/* 2. Strategic Goals (OKRs) - Progress Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STRATEGIC_GOALS.map((goal, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-coffee-900 p-6 rounded-[2rem] border border-coffee-100 dark:border-coffee-800 shadow-sm relative overflow-hidden group"
          >
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-xs font-bold text-coffee-400 dark:text-coffee-400 uppercase tracking-wider mb-1">
                  {goal.label}
                </p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-2xl font-bold text-coffee-900 dark:text-white">
                    {goal.unit}
                    {goal.current.toLocaleString()}
                  </h3>
                  <span className="text-xs text-coffee-500 dark:text-coffee-400 font-medium">
                    / {goal.unit}
                    {goal.target.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="bg-coffee-50 dark:bg-coffee-800 p-2 rounded-xl">
                <Target className="w-5 h-5 text-coffee-700 dark:text-coffee-300" />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-3 w-full bg-coffee-50 dark:bg-coffee-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${getProgressWidth(goal.current, goal.target)}%`,
                }}
                transition={{ duration: 1, delay: 0.2 }}
                className={`h-full rounded-full ${goal.color}`}
              />
            </div>
            <p className="text-right text-[10px] text-coffee-400 mt-2 font-bold uppercase">
              {Math.round((goal.current / goal.target) * 100)}%{" "}
              {t("dashboard.admin.toTarget")}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Operations & Exceptions */}
        <div className="xl:col-span-2 space-y-8">
          {/* 3. Action Center (Exception Reporting) */}
          <div className="bg-white dark:bg-coffee-900 rounded-[2rem] border border-error/20 dark:border-error/30 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-coffee-50 dark:border-coffee-800 bg-error/5 dark:bg-error/10 flex justify-between items-center">
              <h3 className="font-bold text-lg text-coffee-900 dark:text-white flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-error" />
                {t("dashboard.admin.morningBriefing")}{" "}
                <span className="text-coffee-400 font-normal text-sm ml-1 hidden sm:inline">
                  ({t("dashboard.admin.requiresAttention")})
                </span>
              </h3>
              <Badge variant="destructive">
                {EXCEPTION_ALERTS.length} {t("dashboard.admin.issues")}
              </Badge>
            </div>
            <div className="divide-y divide-coffee-50 dark:divide-coffee-800">
              {EXCEPTION_ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-coffee-50/50 dark:hover:bg-coffee-800/30 transition-colors group"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 sm:mt-0 shrink-0 ${
                        alert.priority === "critical"
                          ? "bg-error animate-pulse"
                          : alert.priority === "warning"
                          ? "bg-warning"
                          : "bg-info"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-bold text-coffee-900 dark:text-coffee-100 leading-tight mb-1">
                        {alert.message}
                      </p>
                      <p className="text-xs text-coffee-500 dark:text-coffee-400 flex items-center gap-2">
                        <span className="uppercase tracking-wider font-bold text-[10px]">
                          {alert.type}
                        </span>
                        <span>•</span>
                        <span>{alert.time}</span>
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs border-coffee-200 dark:border-coffee-700 hover:bg-white dark:hover:bg-coffee-800 text-coffee-700 dark:text-coffee-300 w-full sm:w-auto"
                  >
                    {t("dashboard.admin.resolve")}
                  </Button>
                </div>
              ))}
              {EXCEPTION_ALERTS.length === 0 && (
                <div className="p-8 text-center text-coffee-500">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-success" />
                  <p>{t("dashboard.admin.allSystemsNominal")}</p>
                </div>
              )}
            </div>
          </div>

          {/* 4. Financial Performance (Balanced Scorecard: Financial) */}
          <div className="bg-white dark:bg-coffee-900 p-8 rounded-[2rem] border border-coffee-100 dark:border-coffee-800 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold text-coffee-900 dark:text-white">
                  {t("dashboard.admin.revenueTrend")}
                </h3>
                <p className="text-sm text-coffee-500 dark:text-coffee-400">
                  {t("dashboard.admin.last7Days")}
                </p>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-lg">
                  <TrendingUp className="w-3 h-3" /> +12.5%
                </span>
              </div>
            </div>

            {/* CSS Bar Chart */}
            <div className="h-48 flex items-end justify-between gap-2 md:gap-6 px-2">
              {[65, 59, 80, 81, 56, 55, 72].map((val, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col justify-end h-full group"
                >
                  <div className="relative w-full bg-coffee-100 dark:bg-coffee-800 rounded-t-xl overflow-hidden group-hover:bg-coffee-200 dark:group-hover:bg-coffee-700 transition-colors">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${val}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className="absolute bottom-0 left-0 right-0 bg-coffee-900 dark:bg-coffee-500 w-full rounded-t-xl"
                    />
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                      {CURRENCY}
                      {(val * 120).toLocaleString()}
                    </div>
                  </div>
                  <span className="text-[10px] text-center text-coffee-400 font-bold uppercase mt-2">
                    {(t("common.daysShort") as any)[idx]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: People & Process */}
        <div className="space-y-8">
          {/* 5. Internal Process Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-coffee-900 p-5 rounded-[2rem] border border-coffee-100 dark:border-coffee-800 shadow-sm flex flex-col justify-between h-40">
              <div className="bg-info/10 dark:bg-info/20 w-10 h-10 rounded-full flex items-center justify-center text-info dark:text-info mb-2">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-coffee-900 dark:text-white">
                  3m 12s
                </p>
                <p className="text-xs text-coffee-500 dark:text-coffee-400 font-medium leading-tight mt-1">
                  {t("dashboard.admin.avgOrderTime")}
                </p>
              </div>
              <div className="w-full bg-gray-100 dark:bg-coffee-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-info w-[70%] h-full rounded-full" />
              </div>
            </div>

            <div className="bg-white dark:bg-coffee-900 p-5 rounded-[2rem] border border-coffee-100 dark:border-coffee-800 shadow-sm flex flex-col justify-between h-40">
              <div className="bg-success/10 dark:bg-success/20 w-10 h-10 rounded-full flex items-center justify-center text-success dark:text-success mb-2">
                <ThumbsUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-coffee-900 dark:text-white">
                  4.8/5
                </p>
                <p className="text-xs text-coffee-500 dark:text-coffee-400 font-medium leading-tight mt-1">
                  {t("dashboard.admin.customerSatisfaction")}
                </p>
              </div>
              <div className="w-full bg-gray-100 dark:bg-coffee-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-success w-[96%] h-full rounded-full" />
              </div>
            </div>
          </div>

          {/* 6. Top Products (Real Data from BE) */}
          <div className="bg-coffee-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-yellow-400" />
                  Top Products
                </h3>
                <span className="text-[10px] uppercase tracking-widest bg-white/10 px-2 py-1 rounded text-coffee-200">
                  {t("dashboard.admin.thisWeek")}
                </span>
              </div>

              <div className="space-y-6">
                {displayTopProducts.length > 0 ? (
                  displayTopProducts.map((product, i) => (
                    <div
                      key={product.id || i}
                      className="flex items-center gap-3"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-lg bg-coffee-800 border-2 border-white/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-yellow-400">
                            #{i + 1}
                          </span>
                        </div>
                        {i === 0 && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-coffee-900" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-sm truncate">
                            {product.name}
                          </p>
                          <p className="text-xs font-mono text-yellow-400">
                            {CURRENCY}
                            {product.revenue?.toLocaleString() || 0}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-0.5">
                          <p className="text-xs text-white/50">
                            {product.quantity} sold
                          </p>
                          <p className="text-[10px] text-white/70">
                            Revenue: {CURRENCY}
                            {product.revenue?.toLocaleString() || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-white/50 text-center py-4">
                    No product data available
                  </p>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-white/10">
                <Button
                  variant="ghost"
                  fullWidth
                  className="text-white hover:bg-white/10 hover:text-white justify-between group"
                  onClick={() => navigate("/dashboard/products")}
                >
                  <span className="text-xs font-bold uppercase tracking-widest">
                    View All Products
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Decorative BG */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
