import React from "react";
import { motion } from "framer-motion";
import { Button } from "./Button";
import {
  ShoppingCart,
  Heart,
  Package,
  Search,
  FileX,
  Bookmark,
  Coffee,
  LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionPath?: string;
  onAction?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FileX,
  title,
  description,
  actionLabel,
  actionPath,
  onAction,
  className,
  size = "md",
}) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionPath) {
      navigate(actionPath);
    }
  };

  const sizeConfig = {
    sm: {
      container: "py-12",
      iconWrapper: "w-16 h-16",
      icon: "w-8 h-8",
      title: "text-xl",
      description: "text-sm",
    },
    md: {
      container: "py-20",
      iconWrapper: "w-24 h-24",
      icon: "w-10 h-10",
      title: "text-2xl",
      description: "text-base",
    },
    lg: {
      container: "py-32",
      iconWrapper: "w-28 h-28",
      icon: "w-12 h-12",
      title: "text-3xl md:text-4xl",
      description: "text-lg md:text-xl",
    },
  };

  const config = sizeConfig[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center text-center px-6",
        "bg-gradient-to-br from-coffee-50 to-white dark:from-coffee-900 dark:to-coffee-950",
        "rounded-[2rem] md:rounded-[3rem] border border-coffee-100 dark:border-coffee-800",
        "shadow-inner relative overflow-hidden",
        config.container,
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

      <div className="relative z-10 flex flex-col items-center max-w-md">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className={cn(
            "bg-white dark:bg-coffee-800 rounded-full flex items-center justify-center mb-6 md:mb-8",
            "shadow-2xl shadow-coffee-100 dark:shadow-none",
            config.iconWrapper
          )}
        >
          <Icon
            className={cn("text-coffee-400 dark:text-coffee-300", config.icon)}
          />
        </motion.div>

        <h3
          className={cn(
            "font-serif font-bold text-coffee-900 dark:text-white mb-3 md:mb-4",
            config.title
          )}
        >
          {title}
        </h3>

        <p
          className={cn(
            "text-coffee-600 dark:text-coffee-300 leading-relaxed mb-8 md:mb-10",
            config.description
          )}
        >
          {description}
        </p>

        {(actionLabel || onAction) && (
          <Button
            size={size === "lg" ? "lg" : "md"}
            onClick={handleAction}
            className="rounded-full px-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
          >
            {actionLabel || "Take Action"}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

// Preset Empty States
export const EmptyCart: React.FC<{ className?: string }> = ({ className }) => (
  <EmptyState
    icon={ShoppingCart}
    title="Your cart is empty"
    description="Looks like you haven't added any items yet. Start exploring our menu to find your perfect brew."
    actionLabel="Browse Menu"
    actionPath="/menu"
    className={className}
    size="lg"
  />
);

export const EmptyFavorites: React.FC<{ className?: string }> = ({
  className,
}) => (
  <EmptyState
    icon={Heart}
    title="No favorites yet"
    description="Save items you love by tapping the heart icon. They'll appear here for quick access."
    actionLabel="Discover Products"
    actionPath="/menu"
    className={className}
    size="lg"
  />
);

export const EmptyWishlist: React.FC<{ className?: string }> = ({
  className,
}) => (
  <EmptyState
    icon={Bookmark}
    title="Your wishlist is empty"
    description="Bookmark products you want to buy later. Perfect for planning your next order."
    actionLabel="Start Browsing"
    actionPath="/menu"
    className={className}
    size="lg"
  />
);

export const EmptyOrders: React.FC<{ className?: string }> = ({
  className,
}) => (
  <EmptyState
    icon={Package}
    title="No orders yet"
    description="You haven't placed any orders yet. Your order history will appear here once you make your first purchase."
    actionLabel="Place Your First Order"
    actionPath="/menu"
    className={className}
    size="lg"
  />
);

export const NoSearchResults: React.FC<{
  query?: string;
  onClear?: () => void;
  className?: string;
}> = ({ query, onClear, className }) => (
  <EmptyState
    icon={Search}
    title="No results found"
    description={
      query
        ? `We couldn't find anything matching "${query}". Try different keywords or browse our menu.`
        : "We couldn't find what you're looking for. Try different filters or keywords."
    }
    actionLabel="Clear Search"
    onAction={onClear}
    className={className}
    size="md"
  />
);

export const NoData: React.FC<{
  title?: string;
  description?: string;
  className?: string;
}> = ({
  title = "No data available",
  description = "There's nothing to display here yet.",
  className,
}) => (
  <EmptyState
    icon={Coffee}
    title={title}
    description={description}
    className={className}
    size="sm"
  />
);
