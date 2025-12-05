import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  Coffee,
  ShoppingBag,
  AlertCircle,
  ChefHat,
  Filter,
  UtensilsCrossed,
} from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";
import { toast } from "sonner";
import { useLanguage } from "../../contexts/LanguageContext";

// --- Mock Data with Enhanced Details ---

interface KDSItem {
  id: string;
  name: string;
  quantity: number;
  category: "coffee" | "pastry" | "food";
  modifiers?: string[];
  notes?: string;
}

interface KDSOrder extends Omit<Order, "items" | "status"> {
  items: KDSItem[];
  elapsedMinutes: number; // Simulated elapsed time for demo
  status: OrderStatus;
}

const MOCK_ACTIVE_ORDERS: KDSOrder[] = [
  {
    id: "1023",
    backendId: "backend-1023",
    createdAt: new Date().toISOString(),
    customerName: "Alice Johnson",
    items: [
      {
        id: "1",
        name: "Espresso Romano",
        quantity: 1,
        category: "coffee",
        modifiers: ["Extra Shot", "Oat Milk"],
      },
      {
        id: "3",
        name: "Almond Croissant",
        quantity: 2,
        category: "pastry",
        notes: "Warmed up",
      },
    ],
    status: "preparing",
    total: 12.5,
    userId: "u1",
    date: new Date(Date.now() - 1000 * 60 * 4).toISOString(), // 4 mins ago
    elapsedMinutes: 4,
    location: "Table 5",
    timeline: [],
  },
  {
    id: "1024",
    backendId: "backend-1024",
    createdAt: new Date().toISOString(),
    customerName: "Bob Smith",
    items: [
      {
        id: "5",
        name: "Caramel Macchiato",
        quantity: 1,
        category: "coffee",
        modifiers: ["Large", "Skim Milk", "Less Ice"],
      },
    ],
    status: "pending",
    total: 5.75,
    userId: "u2",
    date: new Date(Date.now() - 1000 * 60 * 1).toISOString(), // 1 min ago
    elapsedMinutes: 1,
    location: "Pickup",
    timeline: [],
  },
  {
    id: "1025",
    backendId: "backend-1025",
    createdAt: new Date().toISOString(),
    customerName: "Charlie D.",
    items: [
      {
        id: "6",
        name: "Avocado Toast",
        quantity: 1,
        category: "food",
        modifiers: ["Add Poached Egg"],
      },
      { id: "7", name: "Cold Brew", quantity: 1, category: "coffee" },
    ],
    status: "pending",
    total: 18.0,
    userId: "u3",
    date: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 mins ago (Late!)
    elapsedMinutes: 12,
    location: "Table 12",
    timeline: [],
  },
  {
    id: "1022",
    backendId: "backend-1022",
    createdAt: new Date().toISOString(),
    customerName: "Dana Lee",
    items: [{ id: "8", name: "Matcha Latte", quantity: 1, category: "coffee" }],
    status: "ready",
    total: 4.5,
    userId: "u4",
    date: new Date(Date.now() - 1000 * 60 * 8).toISOString(), // 8 mins ago
    elapsedMinutes: 8,
    location: "Pickup",
    timeline: [],
  },
];

// --- Components ---

const OrderTimer = ({
  startTime,
  initialElapsed,
}: {
  startTime: string;
  initialElapsed: number;
}) => {
  const [elapsed, setElapsed] = useState(initialElapsed);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1); // Increment minute every minute (simulated speed for demo)
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Urgency Logic
  let colorClass = "text-success bg-success/10 border-success/30";
  if (elapsed >= 5) colorClass = "text-warning bg-warning/10 border-warning/30";
  if (elapsed >= 10)
    colorClass = "text-error bg-error/10 border-error/30 animate-pulse";

  return (
    <div
      className={cn(
        "px-3 py-1 rounded-lg border text-sm font-mono font-bold flex items-center gap-2",
        colorClass
      )}
    >
      <Clock className="w-4 h-4" />
      {elapsed}m
    </div>
  );
};

export const BaristaView: React.FC = () => {
  const [orders, setOrders] = useState<KDSOrder[]>(MOCK_ACTIVE_ORDERS);
  const [filter, setFilter] = useState<
    "all" | "pending" | "preparing" | "ready"
  >("all");
  const { t, language } = useLanguage();

  const updateStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prev) => {
      const newOrders = prev.map((o) =>
        o.id === orderId ? { ...o, status: nextStatus } : o
      );
      // If completed, remove after delay? For KDS, usually we keep until manual clear, but let's filter out 'completed'
      if (nextStatus === "completed") {
        toast.success(t("dashboard.barista.orderCompleted", { id: orderId }));
        return newOrders.filter((o) => o.id !== orderId);
      }
      return newOrders;
    });
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === "all") return true;
    return o.status === filter;
  });

  // Calculate stats
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const avgTime = Math.round(
    orders.reduce((acc, curr) => acc + curr.elapsedMinutes, 0) /
      (orders.length || 1)
  );

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
      className="space-y-6 h-full flex flex-col"
    >
      {/* KDS Header */}
      <header className="bg-white dark:bg-coffee-900 p-4 rounded-2xl border border-coffee-100 dark:border-coffee-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="p-3 bg-coffee-900 text-white rounded-xl shadow-lg shrink-0">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-coffee-900 dark:text-white">
              {t("dashboard.barista.kds")}
            </h1>
            <p className="text-xs text-coffee-500 dark:text-coffee-400 font-medium uppercase tracking-wider">
              {new Date().toLocaleDateString(
                language === "id" ? "id-ID" : "en-US"
              )}{" "}
              • {orders.length} {t("dashboard.barista.activeTickets")}
            </p>
          </div>
        </div>

        {/* Stats & Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 px-4 py-2 bg-coffee-50 dark:bg-coffee-800 rounded-lg border border-coffee-100 dark:border-coffee-700 w-full sm:w-auto justify-center sm:justify-start">
            <span className="text-xs text-coffee-500 dark:text-coffee-400 uppercase font-bold">
              {t("dashboard.barista.avgTktTime")}:
            </span>
            <span
              className={cn(
                "font-mono font-bold text-lg",
                avgTime > 8 ? "text-error" : "text-coffee-900 dark:text-white"
              )}
            >
              {avgTime}m
            </span>
          </div>

          <div className="h-8 w-px bg-coffee-200 mx-2 hidden md:block"></div>

          <div className="flex bg-coffee-100/50 dark:bg-coffee-800/50 p-1 rounded-xl overflow-x-auto max-w-full no-scrollbar w-full sm:w-auto">
            {["all", "pending", "preparing", "ready"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap flex-1 sm:flex-none",
                  filter === f
                    ? "bg-white dark:bg-coffee-700 text-coffee-900 dark:text-white shadow-sm"
                    : "text-coffee-500 dark:text-coffee-400 hover:text-coffee-700 dark:hover:text-coffee-200"
                )}
              >
                {t(("common.orderStatus." + f) as any)}
                {f === "pending" && pendingCount > 0 && (
                  <span className="ml-2 bg-error text-white text-[10px] px-1.5 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 flex-1 overflow-y-auto pb-20">
        <AnimatePresence mode="popLayout">
          {filteredOrders.map((order) => {
            const isLate = order.elapsedMinutes >= 10;

            return (
              <motion.div
                layout
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                key={order.id}
                className={cn(
                  "flex flex-col rounded-2xl bg-white dark:bg-coffee-900 border-2 shadow-sm overflow-hidden relative",
                  isLate
                    ? "border-error/20 dark:border-error/30 shadow-error/10"
                    : "border-coffee-50 dark:border-coffee-800"
                )}
              >
                {/* Ticket Header */}
                <div
                  className={cn(
                    "p-4 flex justify-between items-start border-b",
                    order.status === "ready"
                      ? "bg-success/10 dark:bg-success/20 border-success/20 dark:border-success/30"
                      : order.status === "preparing"
                      ? "bg-warning/10 dark:bg-warning/20 border-warning/20 dark:border-warning/30"
                      : "bg-gray-50 dark:bg-coffee-800/50 border-gray-100 dark:border-coffee-700"
                  )}
                >
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-coffee-900 dark:text-white">
                        #{order.id.slice(-3)}
                      </span>
                      <span className="text-xs font-bold text-coffee-400 uppercase tracking-wider">
                        {t(("common.orderStatus." + order.status) as any)}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-coffee-700 dark:text-coffee-300 truncate max-w-[150px]">
                      {order.customerName}
                    </p>
                  </div>
                  <OrderTimer
                    startTime={order.date}
                    initialElapsed={order.elapsedMinutes}
                  />
                </div>

                {/* Items List */}
                <div className="flex-1 p-4 space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                      {/* Quantity Box */}
                      <div className="w-8 h-8 shrink-0 bg-coffee-100 dark:bg-coffee-800 rounded-lg flex items-center justify-center text-lg font-black text-coffee-900 dark:text-white">
                        {item.quantity}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 dark:text-gray-200 text-lg leading-tight">
                          {item.name}
                        </p>

                        {item.modifiers && item.modifiers.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {item.modifiers.map((mod, i) => (
                              <span
                                key={i}
                                className="text-xs font-bold text-error bg-error/10 px-1.5 py-0.5 rounded border border-error/30"
                              >
                                {mod}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Notes */}
                        {item.notes && (
                          <p className="text-xs italic text-coffee-500 mt-1 border-l-2 border-yellow-400 pl-2">
                            {t("dashboard.barista.note", { note: item.notes })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Footer (Big Touch Target) */}
                <div className="p-2 border-t border-gray-100 dark:border-coffee-800 bg-gray-50/50 dark:bg-coffee-800/30">
                  {order.status === "pending" && (
                    <button
                      onClick={() => updateStatus(order.id, "preparing")}
                      className="w-full py-4 rounded-xl bg-white dark:bg-coffee-800 border-2 border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-white font-bold shadow-sm hover:bg-coffee-50 dark:hover:bg-coffee-700 hover:border-coffee-300 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <UtensilsCrossed className="w-5 h-5" />
                      {t("dashboard.barista.startPrep")}
                    </button>
                  )}

                  {order.status === "preparing" && (
                    <button
                      onClick={() => updateStatus(order.id, "ready")}
                      className="w-full py-4 rounded-xl bg-coffee-900 text-white font-bold shadow-md hover:bg-coffee-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5 text-success" />
                      {t("dashboard.barista.markReady")}
                    </button>
                  )}

                  {order.status === "ready" && (
                    <button
                      onClick={() => updateStatus(order.id, "completed")}
                      className="w-full py-4 rounded-xl bg-success/10 text-success border border-success/30 font-bold hover:bg-success/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      {t("dashboard.barista.complete")}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredOrders.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-coffee-300">
            <div className="w-24 h-24 bg-coffee-50 rounded-full flex items-center justify-center mb-6">
              <Coffee className="w-10 h-10 opacity-30" />
            </div>
            <h3 className="text-xl font-bold text-coffee-400">
              {t("dashboard.barista.noOrders").replace(
                "{status}",
                filter !== "all"
                  ? t(("common.orderStatus." + filter) as any)
                  : ""
              )}
            </h3>
            <p className="text-sm">{t("dashboard.barista.greatJob")}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
