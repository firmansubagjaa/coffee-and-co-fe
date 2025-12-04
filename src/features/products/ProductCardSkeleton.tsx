import React from "react";

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div
      className="bg-white dark:bg-coffee-900 rounded-3xl shadow-sm border border-coffee-50 dark:border-coffee-800 flex flex-col h-full overflow-hidden"
      role="status"
      aria-label="Loading product"
    >
      <div className="p-3">
        {/* Image Placeholder */}
        <div className="relative aspect-square rounded-2xl bg-coffee-100/50 dark:bg-coffee-800 animate-pulse" />
      </div>

      <div className="p-5 pt-2 flex flex-col flex-1 gap-4">
        {/* Top Row: Category & Price */}
        <div className="flex justify-between items-start">
          <div className="h-3 w-16 bg-coffee-100/50 rounded animate-pulse" />
          <div className="h-6 w-14 bg-coffee-100/50 rounded-full animate-pulse" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-6 w-3/4 bg-coffee-100/50 rounded animate-pulse" />
        </div>

        {/* Description Lines */}
        <div className="space-y-2 mb-2">
          <div className="h-3 w-full bg-coffee-100/50 rounded animate-pulse" />
          <div className="h-3 w-2/3 bg-coffee-100/50 rounded animate-pulse" />
        </div>

        {/* Button Placeholder */}
        <div className="mt-auto pt-2">
          <div className="h-11 w-full bg-coffee-100/50 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};
