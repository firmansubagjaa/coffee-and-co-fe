import React, { useState } from "react";
import { Bell, CheckCircle, AlertTriangle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../features/auth/store";
import { cn } from "../../utils/cn";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "success" | "warning" | "info";
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Order Ready",
    message: "Order #3985 is ready for pickup!",
    time: "2 mins ago",
    type: "success",
    read: false,
  },
  {
    id: "2",
    title: "Low Stock Alert",
    message: "Oat Milk inventory is below 10%.",
    time: "1 hour ago",
    type: "warning",
    read: false,
  },
  {
    id: "3",
    title: "New Application",
    message: "Received resume for Barista role.",
    time: "3 hours ago",
    type: "info",
    read: true,
  },
];

export const NotificationPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      default:
        return <Info className="w-4 h-4 text-info" />;
    }
  };

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3.5 text-coffee-800 hover:bg-white/50 rounded-full transition-all group focus:outline-none"
        aria-label="Notifications"
      >
        <Bell
          className={cn(
            "h-6 w-6 transition-transform group-hover:rotate-12",
            isOpen && "fill-current"
          )}
        />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 h-2.5 w-2.5 bg-error rounded-full border border-white"
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-coffee-100 overflow-hidden z-50 origin-top-right"
            >
              <div className="p-4 border-b border-coffee-50 flex justify-between items-center bg-coffee-50/30">
                <h3 className="font-bold text-coffee-900">Notifications</h3>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-coffee-500 hover:text-error transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-coffee-400">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No new notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-coffee-50">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "p-4 flex gap-3 hover:bg-gray-50 transition-colors relative group cursor-pointer",
                          !item.read && "bg-blue-50/30"
                        )}
                        onClick={() => markAsRead(item.id)}
                      >
                        <div className="mt-0.5 shrink-0">
                          {getIcon(item.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <p
                              className={cn(
                                "text-sm text-coffee-900",
                                !item.read ? "font-bold" : "font-medium"
                              )}
                            >
                              {item.title}
                            </p>
                            <span className="text-[10px] text-coffee-400 whitespace-nowrap ml-2">
                              {item.time}
                            </span>
                          </div>
                          <p className="text-xs text-coffee-600 leading-relaxed">
                            {item.message}
                          </p>
                        </div>
                        {!item.read && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
