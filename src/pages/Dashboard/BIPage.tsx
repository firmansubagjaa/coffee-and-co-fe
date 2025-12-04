import React from "react";
import {
  BrainCircuit,
  Activity,
  Database,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { Button } from "../../components/common/Button";

import { useLanguage } from "../../contexts/LanguageContext";

export const BIPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-coffee-900 dark:text-white flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-purple-600" />
            {t("dashboard.bi.title")}
          </h1>
          <p className="text-coffee-500 dark:text-coffee-400 mt-1">
            {t("dashboard.bi.subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-white dark:bg-coffee-900 dark:text-white dark:border-coffee-700 gap-2"
          >
            <Database className="w-4 h-4" /> {t("dashboard.bi.dataSources")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Churn Prediction Model */}
        <div className="xl:col-span-2 bg-white dark:bg-coffee-900 p-8 rounded-[2.5rem] border border-coffee-100 dark:border-coffee-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-coffee-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-error" />
                {t("dashboard.bi.churn.title")}
              </h3>
              <p className="text-sm text-coffee-500 dark:text-coffee-400">
                {t("dashboard.bi.churn.modelInfo")}
              </p>
            </div>
            <span className="px-3 py-1 bg-success/10 text-success text-xs font-bold rounded-full">
              {t("dashboard.bi.churn.active")}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-coffee-400 dark:text-coffee-500 uppercase border-b border-coffee-100 dark:border-coffee-800">
                  <th className="pb-3">
                    {t("dashboard.bi.churn.table.customer")}
                  </th>
                  <th className="pb-3">
                    {t("dashboard.bi.churn.table.lastVisit")}
                  </th>
                  <th className="pb-3">
                    {t("dashboard.bi.churn.table.avgSpend")}
                  </th>
                  <th className="pb-3">
                    {t("dashboard.bi.churn.table.riskScore")}
                  </th>
                  <th className="pb-3 text-right">
                    {t("dashboard.bi.churn.table.action")}
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  {
                    id: "C-9921",
                    last: "24 days ago",
                    spend: "$12.50",
                    risk: 88,
                  },
                  {
                    id: "C-8832",
                    last: "18 days ago",
                    spend: "$45.00",
                    risk: 72,
                  },
                  {
                    id: "C-1209",
                    last: "12 days ago",
                    spend: "$8.00",
                    risk: 65,
                  },
                  {
                    id: "C-4451",
                    last: "5 days ago",
                    spend: "$22.00",
                    risk: 12,
                  },
                ].map((row, i) => (
                  <tr
                    key={i}
                    className="group hover:bg-gray-50 dark:hover:bg-coffee-800/50 transition-colors border-b border-gray-50 dark:border-coffee-800 last:border-0"
                  >
                    <td className="py-4 font-mono text-coffee-600 dark:text-coffee-400">
                      {row.id}
                    </td>
                    <td className="py-4 text-coffee-900 dark:text-white">
                      {row.last}
                    </td>
                    <td className="py-4 text-coffee-900 dark:text-white">
                      {row.spend}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              row.risk > 80
                                ? "bg-error"
                                : row.risk > 50
                                ? "bg-warning"
                                : "bg-success"
                            }`}
                            style={{ width: `${row.risk}%` }}
                          ></div>
                        </div>
                        <span className="font-bold">{row.risk}%</span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-xs font-bold text-info hover:underline">
                        {row.risk > 70
                          ? t("dashboard.bi.churn.table.sendOffer")
                          : t("dashboard.bi.churn.table.view")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Demand Forecasting */}
        <div className="bg-coffee-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <TrendingUp className="w-32 h-32" />
          </div>
          <h3 className="text-xl font-bold mb-2">
            {t("dashboard.bi.forecast.title")}
          </h3>
          <p className="text-coffee-300 text-sm mb-8">
            {t("dashboard.bi.forecast.subtitle")}
          </p>

          <div className="space-y-6 relative z-10">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{t("dashboard.bi.products.wholeMilk")}</span>
                <span className="text-yellow-400 font-bold">
                  {t("dashboard.bi.forecast.predicted", { percent: "+15" })}
                </span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 w-[85%]"></div>
              </div>
              <p className="text-xs text-coffee-300 mt-1">
                {t("dashboard.bi.forecast.recommended", { amount: 120 })}
              </p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{t("dashboard.bi.products.espressoBeans")}</span>
                <span className="text-success font-bold">
                  {t("dashboard.bi.forecast.stable")}
                </span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-success w-[60%]"></div>
              </div>
              <p className="text-xs text-coffee-300 mt-1">
                {t("dashboard.bi.forecast.recommended", { amount: 45 })}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-start gap-3 bg-white/10 p-4 rounded-xl">
                <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0" />
                <div>
                  <p className="text-sm font-bold">
                    {t("dashboard.bi.forecast.alert.title")}
                  </p>
                  <p className="text-xs text-coffee-200 mt-1">
                    {t("dashboard.bi.forecast.alert.desc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Engineering / Query Section */}
      <div className="bg-[#1e1e1e] rounded-[2.5rem] p-8 shadow-sm border border-gray-800 text-gray-300 font-mono text-sm">
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-error"></div>
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <div className="w-3 h-3 rounded-full bg-success"></div>
          </div>
          <span className="text-gray-500">
            {t("dashboard.bi.query.console")}
          </span>
        </div>
        <div className="space-y-2 mb-6">
          <p>
            <span className="text-info">SELECT</span> category,{" "}
            <span className="text-warning">AVG</span>(sentiment_score)
          </p>
          <p>
            <span className="text-info">FROM</span> reviews_nlp_processed
          </p>
          <p>
            <span className="text-info">WHERE</span> date {">"}{" "}
            <span className="text-success">NOW()</span> -{" "}
            <span className="text-info">INTERVAL</span> '30 days'
          </p>
          <p>
            <span className="text-info">GROUP BY</span> category;
          </p>
        </div>
        <div className="bg-black/50 p-4 rounded-xl border border-gray-700">
          <p className="text-success mb-2">
            {">"} {t("dashboard.bi.query.executed", { time: "0.45" })}
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-sm">
            <span>{t("common.categories.coffee")}</span>{" "}
            <span className="text-right">0.89</span>
            <span>{t("common.categories.pastry")}</span>{" "}
            <span className="text-right">0.92</span>
            <span>{t("dashboard.bi.categories.service")}</span>{" "}
            <span className="text-right text-yellow-500">0.65</span>
          </div>
        </div>
      </div>
    </div>
  );
};
