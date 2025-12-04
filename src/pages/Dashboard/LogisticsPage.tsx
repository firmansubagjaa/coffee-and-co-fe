import React, { useState } from "react";
import {
  ClipboardList,
  Zap,
  Droplet,
  Package,
  Thermometer,
  AlertTriangle,
  Coffee,
} from "lucide-react";
import { StationItem } from "@/types";
import { Button } from "../../components/common/Button";
import { cn } from "../../utils/cn";
import { toast } from "sonner";
import { useLanguage } from "../../contexts/LanguageContext";

const INITIAL_LOGISTICS: StationItem[] = [
  // Machines
  {
    id: "m1",
    name: "La Marzocco - Group 1",
    category: "machine",
    status: "ok",
    value: 93.5,
    unit: "°C",
    lastChecked: "10:00 AM",
  },
  {
    id: "m2",
    name: "La Marzocco - Pressure",
    category: "machine",
    status: "ok",
    value: 9.1,
    unit: "Bar",
    lastChecked: "10:00 AM",
  },
  {
    id: "m3",
    name: "Mythos Grinder 1",
    category: "machine",
    status: "ok",
    value: "Fine",
    lastChecked: "08:30 AM",
  },

  // Beans
  {
    id: "b1",
    name: "House Blend (Hopper)",
    category: "beans",
    status: "low",
    value: 20,
    unit: "%",
    lastChecked: "10:15 AM",
  },
  {
    id: "b2",
    name: "Single Origin (Ethiopia)",
    category: "beans",
    status: "ok",
    value: 80,
    unit: "%",
    lastChecked: "09:00 AM",
  },

  // Dairy / Fridge
  {
    id: "d1",
    name: "Whole Milk",
    category: "dairy",
    status: "ok",
    value: "Full",
    lastChecked: "10:00 AM",
  },
  {
    id: "d2",
    name: "Oat Milk",
    category: "dairy",
    status: "low",
    value: "2 Cartons",
    lastChecked: "10:00 AM",
  },
  {
    id: "d3",
    name: "Fridge Temp",
    category: "dairy",
    status: "ok",
    value: 3.0,
    unit: "°C",
    lastChecked: "Auto",
  },

  // Dry Goods
  {
    id: "g1",
    name: "12oz Cups",
    category: "dry_goods",
    status: "critical",
    value: "Empty",
    lastChecked: "10:20 AM",
  },
  {
    id: "g2",
    name: "Lids (Hot)",
    category: "dry_goods",
    status: "ok",
    value: "High",
    lastChecked: "09:00 AM",
  },
];

import { motion } from "framer-motion";

export const LogisticsPage: React.FC = () => {
  const { t } = useLanguage();
  const [logistics, setLogistics] = useState<StationItem[]>(INITIAL_LOGISTICS);

  const updateLogisticStatus = (
    itemId: string,
    status: StationItem["status"]
  ) => {
    setLogistics((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status } : item))
    );
    if (status === "critical") {
      toast.error(t("dashboard.logistics.toast.criticalTitle"), {
        description: t("dashboard.logistics.toast.criticalDesc"),
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-coffee-900 dark:text-white flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-coffee-600 dark:text-coffee-400" />
            {t("dashboard.logistics.title")}
          </h1>
          <p className="text-coffee-500 dark:text-coffee-400 mt-1">
            {t("dashboard.logistics.subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white dark:bg-coffee-900 px-4 py-2 rounded-xl border border-coffee-100 dark:border-coffee-800 text-sm font-medium text-coffee-600 dark:text-coffee-300 shadow-sm">
            {t("dashboard.logistics.lastCheck")}:{" "}
            <span className="font-bold text-coffee-900 dark:text-white">
              {t("dashboard.logistics.justNow")}
            </span>
          </div>
        </div>
      </div>

      {/* Equipment Status */}
      <section>
        <h3 className="text-lg font-bold text-coffee-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />{" "}
          {t("dashboard.logistics.equipmentHealth")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {logistics
            .filter((i) => i.category === "machine")
            .map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="bg-white dark:bg-coffee-900 p-5 rounded-2xl border border-coffee-100 dark:border-coffee-800 shadow-sm flex items-center justify-between"
              >
                <div>
                  <p className="text-sm text-coffee-500 dark:text-coffee-400 font-medium mb-1">
                    {item.name}
                  </p>
                  <p className="text-2xl font-bold text-coffee-900 dark:text-white">
                    {item.value}
                    <span className="text-sm text-coffee-400 ml-1">
                      {item.unit}
                    </span>
                  </p>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    item.status === "ok"
                      ? "bg-success"
                      : "bg-error animate-pulse"
                  }`}
                ></div>
              </motion.div>
            ))}
        </div>
      </section>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Ingredients (Beans & Dairy) */}
        <section className="bg-white dark:bg-coffee-900 p-6 rounded-3xl border border-coffee-100 dark:border-coffee-800 shadow-sm">
          <h3 className="text-lg font-bold text-coffee-900 dark:text-white mb-6 flex items-center gap-2">
            <Droplet className="w-5 h-5 text-info" />{" "}
            {t("dashboard.logistics.ingredients")}
          </h3>
          <div className="space-y-6">
            {logistics
              .filter(
                (i) =>
                  ["beans", "dairy"].includes(i.category) &&
                  i.name !== "Fridge Temp"
              )
              .map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-coffee-50 dark:border-coffee-800 hover:bg-coffee-50/30 dark:hover:bg-coffee-800/30 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-xl ${
                        item.category === "beans"
                          ? "bg-warning/10 text-warning dark:bg-warning/20 dark:text-warning"
                          : "bg-info/10 text-info dark:bg-info/20 dark:text-info"
                      }`}
                    >
                      {item.category === "beans" ? (
                        <Coffee className="w-5 h-5" />
                      ) : (
                        <Droplet className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-coffee-900 dark:text-white">
                        {item.name}
                      </p>
                      <p className="text-xs text-coffee-500 dark:text-coffee-400">
                        {t("dashboard.logistics.current")}:{" "}
                        <span className="font-medium">
                          {item.value} {item.unit}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex bg-coffee-50/50 dark:bg-coffee-800/50 rounded-lg p-1 gap-1 w-full sm:w-auto">
                    <button
                      onClick={() => updateLogisticStatus(item.id, "ok")}
                      className={cn(
                        "flex-1 sm:flex-none px-3 py-1 text-xs font-bold rounded-md transition-colors",
                        item.status === "ok"
                          ? "bg-white dark:bg-coffee-700 text-success dark:text-success shadow-sm border border-coffee-100 dark:border-coffee-600"
                          : "text-coffee-400 hover:text-coffee-600 dark:hover:text-coffee-300"
                      )}
                    >
                      {t("dashboard.logistics.levels.high")}
                    </button>
                    <button
                      onClick={() => updateLogisticStatus(item.id, "low")}
                      className={cn(
                        "flex-1 sm:flex-none px-3 py-1 text-xs font-bold rounded-md transition-colors",
                        item.status === "low"
                          ? "bg-white dark:bg-coffee-700 text-yellow-600 dark:text-yellow-400 shadow-sm border border-coffee-100 dark:border-coffee-600"
                          : "text-coffee-400 hover:text-coffee-600 dark:hover:text-coffee-300"
                      )}
                    >
                      {t("dashboard.logistics.levels.low")}
                    </button>
                    <button
                      onClick={() => updateLogisticStatus(item.id, "critical")}
                      className={cn(
                        "flex-1 sm:flex-none px-3 py-1 text-xs font-bold rounded-md transition-colors",
                        item.status === "critical"
                          ? "bg-white dark:bg-coffee-700 text-error dark:text-error shadow-sm border border-coffee-100 dark:border-coffee-600"
                          : "text-coffee-400 hover:text-coffee-600 dark:hover:text-coffee-300"
                      )}
                    >
                      {t("dashboard.logistics.levels.out")}
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>
        </section>

        {/* Dry Goods & Safety */}
        <div className="space-y-8">
          <section className="bg-white dark:bg-coffee-900 p-6 rounded-3xl border border-coffee-100 dark:border-coffee-800 shadow-sm">
            <h3 className="text-lg font-bold text-coffee-900 dark:text-white mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-coffee-600 dark:text-coffee-400" />{" "}
              {t("dashboard.logistics.supplies")}
            </h3>
            <div className="space-y-6">
              {logistics
                .filter((i) => i.category === "dry_goods")
                .map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-coffee-50 dark:border-coffee-800 hover:bg-coffee-50/30 dark:hover:bg-coffee-800/30"
                  >
                    <div>
                      <p className="font-bold text-coffee-900 dark:text-white">
                        {item.name}
                      </p>
                      {item.status === "critical" && (
                        <span className="text-xs font-bold text-error flex items-center gap-1 mt-1">
                          <AlertTriangle className="w-3 h-3" />{" "}
                          {t("dashboard.inventory.restockNeeded")}
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant={
                        item.status === "critical" ? "primary" : "outline"
                      }
                      onClick={() =>
                        updateLogisticStatus(
                          item.id,
                          item.status === "ok" ? "critical" : "ok"
                        )
                      }
                      className={cn(
                        "w-full sm:w-auto",
                        item.status === "critical"
                          ? "bg-error hover:bg-error/90 border-error text-error-foreground"
                          : ""
                      )}
                    >
                      {item.status === "critical"
                        ? t("dashboard.inventory.restock")
                        : t("dashboard.logistics.markEmpty")}
                    </Button>
                  </motion.div>
                ))}
            </div>
          </section>

          <section className="bg-info/10 dark:bg-info/20 p-6 rounded-3xl border border-info/20 dark:border-info/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-info dark:text-info flex items-center gap-2">
                <Thermometer className="w-5 h-5" />{" "}
                {t("dashboard.logistics.fridgeSafety")}
              </h3>
              <span className="bg-white dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-bold px-2 py-1 rounded shadow-sm">
                {t("dashboard.logistics.checkAuto")}
              </span>
            </div>
            {logistics
              .filter((i) => i.name === "Fridge Temp")
              .map((item) => (
                <div key={item.id} className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-blue-900 dark:text-blue-100">
                    {item.value}
                    {item.unit}
                  </span>
                  <span className="text-sm text-blue-600 dark:text-blue-300 mb-1.5 font-medium">
                    {(item.value as number) < 4
                      ? t("dashboard.logistics.optimalZone")
                      : t("dashboard.logistics.highTemp")}
                  </span>
                </div>
              ))}
            <p className="text-xs text-blue-400 dark:text-blue-400 mt-2">
              {t("dashboard.logistics.haccpLog")}
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
};
