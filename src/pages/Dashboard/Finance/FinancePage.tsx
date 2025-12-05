import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Calculator,
  FileText,
  History,
  AlertCircle,
  Download,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../../../components/common/Button";
import { CURRENCY } from "../../../utils/constants";
import { useFinanceData } from "../../../api/dashboard.hooks";
import { Badge } from "../../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { toast } from "sonner";
import { exportData } from "../../../utils/export";
import { useLanguage } from "../../../contexts/LanguageContext";

// --- Types ---

interface PNLItem {
  category: string;
  amount: number;
  type: "income" | "cogs" | "opex";
}

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module: string;
  details: string;
  severity: "info" | "warning" | "critical";
}

// --- Mock Data ---

const MOCK_PNL: PNLItem[] = [
  { category: "Coffee Sales", amount: 45000, type: "income" },
  { category: "Food Sales", amount: 18500, type: "income" },
  { category: "Merchandise", amount: 4200, type: "income" },
  { category: "Coffee Beans (COGS)", amount: 12000, type: "cogs" },
  { category: "Milk & Dairy (COGS)", amount: 5500, type: "cogs" },
  { category: "Packaging (COGS)", amount: 2100, type: "cogs" },
  { category: "Staff Labor", amount: 18000, type: "opex" },
  { category: "Rent", amount: 4500, type: "opex" },
  { category: "Utilities", amount: 1200, type: "opex" },
  { category: "Marketing", amount: 800, type: "opex" },
  { category: "Maintenance", amount: 500, type: "opex" },
];

const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log_1",
    timestamp: "2024-05-24 14:30",
    user: "Admin User",
    role: "admin",
    action: "Update Role",
    module: "Users",
    details: "Changed Sarah Barista from Customer to Barista",
    severity: "warning",
  },
  {
    id: "log_2",
    timestamp: "2024-05-24 11:15",
    user: "Super Admin",
    role: "superadmin",
    action: "Export Data",
    module: "Analytics",
    details: "Exported Q1 Sales Report (CSV)",
    severity: "info",
  },
  {
    id: "log_3",
    timestamp: "2024-05-23 18:45",
    user: "Admin User",
    role: "admin",
    action: "Stock Adjustment",
    module: "Inventory",
    details: 'Manually adjusted "Oat Milk" stock: -5 units (Waste)',
    severity: "warning",
  },
  {
    id: "log_4",
    timestamp: "2024-05-23 09:00",
    user: "System",
    role: "system",
    action: "Backup",
    module: "System",
    details: "Daily database backup completed",
    severity: "info",
  },
  {
    id: "log_5",
    timestamp: "2024-05-22 16:20",
    user: "Tom Brewer",
    role: "barista",
    action: "Void Order",
    module: "POS",
    details: "Voided Order #3985 (Customer Request)",
    severity: "critical",
  },
];

export const FinancePage: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"pnl" | "valuation" | "audit">(
    "pnl"
  );
  const [multiplier, setMultiplier] = useState<number>(3.0);

  // Fetch finance data from API
  const { data: financeData, isLoading, error } = useFinanceData();

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

  if (error || !financeData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-error mx-auto mb-4" />
          <p className="text-coffee-600 dark:text-coffee-400">
            {t("common.error.loadFailed")}
          </p>
        </div>
      </div>
    );
  }

  // --- P&L Calculations ---
  const totalIncome =
    financeData?.revenue?.total ||
    MOCK_PNL.filter((i) => i.type === "income").reduce(
      (sum, i) => sum + i.amount,
      0
    );
  const totalCOGS = MOCK_PNL.filter((i) => i.type === "cogs").reduce(
    (sum, i) => sum + i.amount,
    0
  );
  const totalOpEx = MOCK_PNL.filter((i) => i.type === "opex").reduce(
    (sum, i) => sum + i.amount,
    0
  );

  const grossProfit = totalIncome - totalCOGS;
  const grossMargin = (grossProfit / totalIncome) * 100;
  const netProfit = grossProfit - totalOpEx;
  const netMargin = (netProfit / totalIncome) * 100;

  // --- Valuation Calculations (SDE Method) ---
  // SDE = Net Profit + Owner Salary (est) + Depreciation + One-time expenses
  const addBacks = 60000; // Estimated annual owner salary + benefits + depreciation
  const annualizedNetProfit = netProfit * 12; // Assuming monthly data mock is representative
  const sde = annualizedNetProfit + addBacks;
  const valuation = sde * multiplier;

  const handleExportAudit = () => {
    exportData(MOCK_AUDIT_LOGS, "system_audit_logs", "csv");
    toast.success(t("dashboard.finance.exportAuditSuccess"));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-coffee-900 dark:text-white flex items-center gap-3">
          <Calculator className="w-8 h-8 text-coffee-600 dark:text-coffee-400" />
          {t("dashboard.finance.title")}
        </h1>
        <p className="text-coffee-500 dark:text-coffee-400 mt-1">
          {t("dashboard.finance.subtitle")}
        </p>
      </div>

      {/* Navigation Tabs - Responsive Scroll */}
      <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-2 p-1 bg-coffee-100/50 dark:bg-coffee-800/50 rounded-xl w-max min-w-full sm:min-w-0">
          {[
            { id: "pnl", label: t("dashboard.finance.pnl"), icon: PieChart },
            {
              id: "valuation",
              label: t("dashboard.finance.valuation"),
              icon: TrendingUp,
            },
            {
              id: "audit",
              label: t("dashboard.finance.auditLogs"),
              icon: History,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-white dark:bg-coffee-700 text-coffee-900 dark:text-white shadow-sm"
                    : "text-coffee-600 dark:text-coffee-400 hover:text-coffee-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-coffee-700/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- TAB: P&L --- */}
      {activeTab === "pnl" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-coffee-900 p-6 rounded-2xl border border-coffee-100 dark:border-coffee-800 shadow-sm">
              <p className="text-xs font-bold text-coffee-400 uppercase tracking-wider mb-1">
                {t("dashboard.finance.totalRevenue")}
              </p>
              <h3 className="text-2xl font-bold text-coffee-900 dark:text-white">
                {CURRENCY}
                {totalIncome.toLocaleString()}
              </h3>
            </div>
            <div className="bg-white dark:bg-coffee-900 p-6 rounded-2xl border border-coffee-100 dark:border-coffee-800 shadow-sm">
              <p className="text-xs font-bold text-coffee-400 uppercase tracking-wider mb-1">
                {t("dashboard.finance.grossProfit")}
              </p>
              <h3 className="text-2xl font-bold text-success dark:text-success">
                {CURRENCY}
                {grossProfit.toLocaleString()}
              </h3>
              <p className="text-xs text-success dark:text-success font-bold mt-1">
                {grossMargin.toFixed(1)}% Margin
              </p>
            </div>
            <div className="bg-white dark:bg-coffee-900 p-6 rounded-2xl border border-coffee-100 dark:border-coffee-800 shadow-sm">
              <p className="text-xs font-bold text-coffee-400 uppercase tracking-wider mb-1">
                {t("dashboard.finance.totalExpenses")}
              </p>
              <h3 className="text-2xl font-bold text-error dark:text-error">
                {CURRENCY}
                {(totalCOGS + totalOpEx).toLocaleString()}
              </h3>
            </div>
            <div className="bg-coffee-900 p-6 rounded-2xl shadow-lg text-white">
              <p className="text-xs font-bold text-coffee-200 uppercase tracking-wider mb-1">
                {t("dashboard.finance.netProfit")}
              </p>
              <h3 className="text-3xl font-bold text-white">
                {CURRENCY}
                {netProfit.toLocaleString()}
              </h3>
              <p className="text-xs text-success font-bold mt-1">
                {netMargin.toFixed(1)}% Net Margin
              </p>
            </div>
          </div>

          {/* Detailed Table */}
          <div className="bg-white dark:bg-coffee-900 rounded-[2rem] border border-coffee-100 dark:border-coffee-800 shadow-sm overflow-hidden p-6 md:p-8">
            <h3 className="text-lg font-bold text-coffee-900 dark:text-white mb-6">
              {t("dashboard.finance.incomeStatement")}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Income & COGS */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-coffee-900 dark:text-white border-b border-coffee-100 dark:border-coffee-800 pb-2 mb-3">
                    {t("dashboard.finance.income")}
                  </h4>
                  <div className="space-y-2">
                    {MOCK_PNL.filter((i) => i.type === "income").map(
                      (item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-coffee-600 dark:text-coffee-400">
                            {item.category}
                          </span>
                          <span className="font-mono font-medium dark:text-gray-300">
                            {CURRENCY}
                            {item.amount.toLocaleString()}
                          </span>
                        </div>
                      )
                    )}
                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-dashed border-coffee-100 dark:border-coffee-800 dark:text-white">
                      <span>{t("dashboard.finance.totalRevenue")}</span>
                      <span>
                        {CURRENCY}
                        {totalIncome.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-coffee-900 dark:text-white border-b border-coffee-100 dark:border-coffee-800 pb-2 mb-3">
                    {t("dashboard.finance.cogs")}
                  </h4>
                  <div className="space-y-2">
                    {MOCK_PNL.filter((i) => i.type === "cogs").map(
                      (item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-coffee-600 dark:text-coffee-400">
                            {item.category}
                          </span>
                          <span className="font-mono font-medium text-error dark:text-error">
                            -{CURRENCY}
                            {item.amount.toLocaleString()}
                          </span>
                        </div>
                      )
                    )}
                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-dashed border-coffee-100 dark:border-coffee-800 dark:text-white">
                      <span>Total COGS</span>
                      <span className="text-error dark:text-error">
                        -{CURRENCY}
                        {totalCOGS.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* OpEx & Summary */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-coffee-900 dark:text-white border-b border-coffee-100 dark:border-coffee-800 pb-2 mb-3">
                    {t("dashboard.finance.opex")}
                  </h4>
                  <div className="space-y-2">
                    {MOCK_PNL.filter((i) => i.type === "opex").map(
                      (item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-coffee-600 dark:text-coffee-400">
                            {item.category}
                          </span>
                          <span className="font-mono font-medium text-error dark:text-error">
                            -{CURRENCY}
                            {item.amount.toLocaleString()}
                          </span>
                        </div>
                      )
                    )}
                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-dashed border-coffee-100 dark:border-coffee-800 dark:text-white">
                      <span>Total OpEx</span>
                      <span className="text-error dark:text-error">
                        -{CURRENCY}
                        {totalOpEx.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-coffee-50 dark:bg-coffee-800 p-6 rounded-xl space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-coffee-600 dark:text-coffee-300">
                      {t("dashboard.finance.grossProfit")}
                    </span>
                    <span className="font-bold dark:text-white">
                      {CURRENCY}
                      {grossProfit.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-coffee-600 dark:text-coffee-300">
                      {t("dashboard.finance.totalExpenses")}
                    </span>
                    <span className="font-bold text-error dark:text-error">
                      -{CURRENCY}
                      {(totalCOGS + totalOpEx).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-white">
                    <span>{t("dashboard.finance.netProfit")}</span>
                    <span>
                      {CURRENCY}
                      {netProfit.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: VALUATION --- */}
      {activeTab === "valuation" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-coffee-900 p-8 rounded-[2rem] border border-coffee-100 dark:border-coffee-800 shadow-sm">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-coffee-900 dark:text-white mb-2">
                {t("dashboard.finance.businessValuation")}
              </h3>
              <p className="text-sm text-coffee-500 dark:text-coffee-400">
                {t("dashboard.finance.valuationSubtitle")}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-coffee-50 dark:bg-coffee-800 rounded-xl gap-2">
                <span className="font-medium text-coffee-700 dark:text-coffee-300">
                  {t("dashboard.finance.annualizedNetProfit")}
                </span>
                <span className="font-mono font-bold text-lg dark:text-white">
                  {CURRENCY}
                  {annualizedNetProfit.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-center text-coffee-300 dark:text-coffee-600">
                <span className="text-2xl">+</span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-coffee-50 dark:bg-coffee-800 rounded-xl gap-2">
                <div className="text-center sm:text-left">
                  <span className="font-medium text-coffee-700 dark:text-coffee-300 block">
                    {t("dashboard.finance.addBacks")}
                  </span>
                  <span className="text-xs text-coffee-500 dark:text-coffee-400">
                    {t("dashboard.finance.addBacksHelper")}
                  </span>
                </div>
                <span className="font-mono font-bold text-lg dark:text-white">
                  {CURRENCY}
                  {addBacks.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-center text-coffee-300 dark:text-coffee-600">
                <span className="text-2xl">=</span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl gap-2">
                <span className="font-bold text-blue-900 dark:text-blue-200">
                  {t("dashboard.finance.sde")}
                </span>
                <span className="font-mono font-bold text-xl text-blue-700 dark:text-blue-300">
                  {CURRENCY}
                  {sde.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-coffee-100 dark:border-coffee-800">
              <label className="block text-sm font-bold text-coffee-900 dark:text-white mb-4">
                {t("dashboard.finance.industryMultiplier")}:{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  {multiplier.toFixed(1)}x
                </span>
              </label>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={multiplier}
                onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                className="w-full h-2 bg-coffee-200 dark:bg-coffee-700 rounded-lg appearance-none cursor-pointer accent-coffee-900 dark:accent-coffee-500"
                aria-label="Industry multiplier"
                title="Adjust industry multiplier"
              />
              <div className="flex justify-between text-xs text-coffee-400 mt-2">
                <span>{t("dashboard.finance.multipliers.distressed")}</span>
                <span>{t("dashboard.finance.multipliers.healthy")}</span>
                <span>{t("dashboard.finance.multipliers.premium")}</span>
              </div>
            </div>
          </div>

          <div className="bg-coffee-900 text-white p-8 rounded-[2rem] shadow-xl flex flex-col justify-center text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-yellow-400" />
            </div>
            <p className="text-coffee-200 uppercase tracking-widest text-xs font-bold mb-2">
              {t("dashboard.finance.estimatedValuation")}
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white">
              {CURRENCY}
              {valuation.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </h2>
            <p className="text-sm text-coffee-300 leading-relaxed">
              {t("dashboard.finance.valuationDisclaimer", {
                multiplier: multiplier.toString(),
              })}
            </p>
          </div>
        </div>
      )}

      {/* --- TAB: AUDIT LOGS --- */}
      {activeTab === "audit" && (
        <div className="bg-white dark:bg-coffee-900 rounded-[2rem] border border-coffee-100 dark:border-coffee-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-coffee-100 dark:border-coffee-800 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-coffee-900 dark:text-white">
                {t("dashboard.finance.systemAuditLogs")}
              </h3>
              <p className="text-sm text-coffee-500 dark:text-coffee-400">
                {t("dashboard.finance.auditSubtitle")}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleExportAudit}
              className="bg-white dark:bg-coffee-800 text-coffee-600 dark:text-coffee-300 border-coffee-200 dark:border-coffee-700 hidden sm:flex"
            >
              <Download className="w-4 h-4 mr-2" />{" "}
              {t("dashboard.finance.exportLogs")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportAudit}
              className="bg-white dark:bg-coffee-800 text-coffee-600 dark:text-coffee-300 border-coffee-200 dark:border-coffee-700 sm:hidden"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-coffee-50/50 dark:bg-coffee-800/50 text-coffee-500 dark:text-coffee-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">
                    {t("dashboard.finance.timestamp")}
                  </th>
                  <th className="px-6 py-4">{t("dashboard.finance.user")}</th>
                  <th className="px-6 py-4">{t("dashboard.finance.module")}</th>
                  <th className="px-6 py-4">{t("dashboard.finance.action")}</th>
                  <th className="px-6 py-4">
                    {t("dashboard.finance.details")}
                  </th>
                  <th className="px-6 py-4 text-right">
                    {t("dashboard.finance.severity")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-coffee-50 dark:divide-coffee-800">
                {MOCK_AUDIT_LOGS.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-coffee-50/30 dark:hover:bg-coffee-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-coffee-500 dark:text-coffee-400 text-xs whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-coffee-900 dark:text-white block whitespace-nowrap">
                        {log.user}
                      </span>
                      <span className="text-xs text-coffee-400 capitalize">
                        {log.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className="bg-white dark:bg-coffee-800 dark:text-coffee-300 dark:border-coffee-700"
                      >
                        {log.module}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-medium text-coffee-800 dark:text-coffee-200">
                      {log.action}
                    </td>
                    <td
                      className="px-6 py-4 text-coffee-600 dark:text-coffee-400 max-w-xs truncate"
                      title={log.details}
                    >
                      {log.details}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Badge
                        variant={
                          log.severity === "critical"
                            ? "destructive"
                            : log.severity === "warning"
                            ? "warning"
                            : "secondary"
                        }
                      >
                        {t(`dashboard.finance.severityLevels.${log.severity}`)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
