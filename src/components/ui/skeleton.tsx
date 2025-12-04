import { cn } from "@/utils/cn";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-coffee-100 dark:bg-coffee-800",
        className
      )}
      {...props}
    />
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#3C2A21] rounded-[2rem] shadow-sm overflow-hidden border border-coffee-50 dark:border-none flex flex-col h-full">
      <div className="p-4">
        <Skeleton className="aspect-square rounded-[1.5rem]" />
      </div>
      <div className="px-6 pb-6 pt-2 flex flex-col flex-1">
        <Skeleton className="h-3 w-16 mb-3" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-6" />
        <div className="flex items-center justify-between mt-auto">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-10 w-10 rounded-full md:hidden" />
        </div>
      </div>
    </div>
  );
}

// Product Grid Skeleton
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-coffee-100 dark:border-coffee-800">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

// Table Skeleton
export function TableSkeleton({
  rows = 5,
  columns = 5,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-coffee-100 dark:border-coffee-800">
      <table className="w-full">
        <thead className="bg-coffee-50 dark:bg-coffee-900">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="p-4 text-left">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Card Skeleton (generic)
export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-coffee-900 rounded-2xl p-6 border border-coffee-100 dark:border-coffee-800">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-8 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

// Stats Card Skeleton
export function StatsCardSkeleton() {
  return (
    <div className="bg-white dark:bg-coffee-900 rounded-2xl p-6 border border-coffee-100 dark:border-coffee-800">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-8 w-24 mb-2" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

// Order Card Skeleton
export function OrderCardSkeleton() {
  return (
    <div className="bg-white dark:bg-coffee-900 rounded-2xl p-6 border border-coffee-100 dark:border-coffee-800">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-coffee-100 dark:border-coffee-800">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  );
}

// Avatar Skeleton
export function AvatarSkeleton({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  return <Skeleton className={cn("rounded-full", sizeClasses[size])} />;
}

// Text Line Skeleton
export function TextSkeleton({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", i === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}

// Page Header Skeleton
export function PageHeaderSkeleton() {
  return (
    <div className="mb-8">
      <Skeleton className="h-4 w-40 mb-4" />
      <Skeleton className="h-10 w-64 mb-2" />
      <Skeleton className="h-5 w-96" />
    </div>
  );
}
