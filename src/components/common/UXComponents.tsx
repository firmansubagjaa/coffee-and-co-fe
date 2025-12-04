/**
 * UX Components
 *
 * Reusable components for enhanced user experience:
 * - Ripple effect
 * - Pulse indicator
 * - Scroll to top button
 * - Progress indicators
 * - Confetti celebrations
 * - Pull to refresh
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  memo,
  forwardRef,
} from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  ArrowUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useReducedMotion } from "@/utils/accessibility";

// ============================================================================
// RIPPLE EFFECT
// ============================================================================

interface RippleProps {
  color?: string;
  duration?: number;
}

export const Ripple = memo<RippleProps>(
  ({ color = "rgba(255, 255, 255, 0.3)", duration = 600 }) => {
    const [ripples, setRipples] = useState<
      { x: number; y: number; id: number }[]
    >([]);

    const addRipple = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setRipples((prev) => [...prev, { x, y, id: Date.now() }]);
    }, []);

    useEffect(() => {
      if (ripples.length > 0) {
        const timeout = setTimeout(() => {
          setRipples((prev) => prev.slice(1));
        }, duration);
        return () => clearTimeout(timeout);
      }
    }, [ripples, duration]);

    return (
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: duration / 1000, ease: "easeOut" }}
              style={{
                position: "absolute",
                left: ripple.x,
                top: ripple.y,
                width: 20,
                height: 20,
                marginLeft: -10,
                marginTop: -10,
                borderRadius: "50%",
                backgroundColor: color,
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    );
  }
);

Ripple.displayName = "Ripple";

// Hook to add ripple to any element
export function useRipple(color?: string) {
  const [ripples, setRipples] = useState<
    { x: number; y: number; id: number }[]
  >([]);

  const addRipple = useCallback((event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setRipples((prev) => [...prev, { x, y, id: Date.now() }]);
  }, []);

  useEffect(() => {
    if (ripples.length > 0) {
      const timeout = setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [ripples]);

  return { ripples, addRipple };
}

// ============================================================================
// PULSE INDICATOR
// ============================================================================

interface PulseIndicatorProps {
  color?: "success" | "error" | "warning" | "info" | "primary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const PulseIndicator = memo<PulseIndicatorProps>(
  ({ color = "success", size = "md", className }) => {
    const colorClasses = {
      success: "bg-success",
      error: "bg-error",
      warning: "bg-warning",
      info: "bg-info",
      primary: "bg-coffee-600",
    };

    const sizeClasses = {
      sm: "h-2 w-2",
      md: "h-3 w-3",
      lg: "h-4 w-4",
    };

    return (
      <span className={cn("relative inline-flex", className)}>
        <span
          className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            colorClasses[color]
          )}
        />
        <span
          className={cn(
            "relative inline-flex rounded-full",
            colorClasses[color],
            sizeClasses[size]
          )}
        />
      </span>
    );
  }
);

PulseIndicator.displayName = "PulseIndicator";

// ============================================================================
// SCROLL TO TOP BUTTON
// ============================================================================

interface ScrollToTopButtonProps {
  threshold?: number;
  className?: string;
}

export const ScrollToTopButton = memo<ScrollToTopButtonProps>(
  ({ threshold = 400, className }) => {
    const [isVisible, setIsVisible] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
      const handleScroll = () => {
        setIsVisible(window.scrollY > threshold);
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }, [threshold]);

    const scrollToTop = useCallback(() => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }, [prefersReducedMotion]);

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className={cn(
              "fixed bottom-6 right-6 z-50 p-3 rounded-full",
              "bg-coffee-600 text-white shadow-lg",
              "hover:bg-coffee-700 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-coffee-600 focus:ring-offset-2",
              className
            )}
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    );
  }
);

ScrollToTopButton.displayName = "ScrollToTopButton";

// ============================================================================
// STATUS BADGE
// ============================================================================

interface StatusBadgeProps {
  status: "success" | "error" | "warning" | "info" | "pending";
  children: React.ReactNode;
  pulse?: boolean;
  className?: string;
}

export const StatusBadge = memo<StatusBadgeProps>(
  ({ status, children, pulse = false, className }) => {
    const statusConfig = {
      success: {
        bg: "bg-success/10",
        text: "text-success",
        icon: CheckCircle,
      },
      error: {
        bg: "bg-error/10",
        text: "text-error",
        icon: XCircle,
      },
      warning: {
        bg: "bg-warning/10",
        text: "text-warning",
        icon: AlertCircle,
      },
      info: {
        bg: "bg-info/10",
        text: "text-info",
        icon: AlertCircle,
      },
      pending: {
        bg: "bg-coffee-100 dark:bg-coffee-800",
        text: "text-coffee-600 dark:text-coffee-300",
        icon: Loader2,
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
          config.bg,
          config.text,
          className
        )}
      >
        {pulse && status !== "pending" && (
          <PulseIndicator
            color={status === "info" ? "info" : status}
            size="sm"
          />
        )}
        {status === "pending" && <Icon className="h-3 w-3 animate-spin" />}
        {!pulse && status !== "pending" && <Icon className="h-3 w-3" />}
        {children}
      </span>
    );
  }
);

StatusBadge.displayName = "StatusBadge";

// ============================================================================
// PROGRESS RING
// ============================================================================

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  showValue?: boolean;
  className?: string;
}

export const ProgressRing = memo<ProgressRingProps>(
  ({
    progress,
    size = 60,
    strokeWidth = 4,
    color = "#795548",
    trackColor = "#E5E7EB",
    showValue = true,
    className,
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className={cn("relative inline-flex", className)}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Track */}
          <circle
            className="transition-all duration-300"
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress */}
          <motion.circle
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-coffee-900 dark:text-white">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>
    );
  }
);

ProgressRing.displayName = "ProgressRing";

// ============================================================================
// COUNTDOWN TIMER
// ============================================================================

interface CountdownProps {
  targetDate: Date;
  onComplete?: () => void;
  className?: string;
}

export const Countdown = memo<CountdownProps>(
  ({ targetDate, onComplete, className }) => {
    const [timeLeft, setTimeLeft] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

    useEffect(() => {
      const calculateTimeLeft = () => {
        const difference = targetDate.getTime() - new Date().getTime();

        if (difference <= 0) {
          onComplete?.();
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      };

      setTimeLeft(calculateTimeLeft());

      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(timer);
    }, [targetDate, onComplete]);

    const TimeBlock = ({ value, label }: { value: number; label: string }) => (
      <div className="flex flex-col items-center">
        <motion.span
          key={value}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl md:text-3xl font-bold text-coffee-900 dark:text-white font-mono"
        >
          {String(value).padStart(2, "0")}
        </motion.span>
        <span className="text-xs text-coffee-500 uppercase tracking-wider">
          {label}
        </span>
      </div>
    );

    return (
      <div className={cn("flex gap-4 md:gap-6", className)}>
        <TimeBlock value={timeLeft.days} label="Days" />
        <span className="text-2xl text-coffee-300 self-start mt-1">:</span>
        <TimeBlock value={timeLeft.hours} label="Hours" />
        <span className="text-2xl text-coffee-300 self-start mt-1">:</span>
        <TimeBlock value={timeLeft.minutes} label="Mins" />
        <span className="text-2xl text-coffee-300 self-start mt-1">:</span>
        <TimeBlock value={timeLeft.seconds} label="Secs" />
      </div>
    );
  }
);

Countdown.displayName = "Countdown";

// ============================================================================
// ANIMATED COUNTER
// ============================================================================

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

export const AnimatedCounter = memo<AnimatedCounterProps>(
  ({
    value,
    duration = 1000,
    formatValue = (v) => Math.round(v).toString(),
    className,
  }) => {
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { duration });
    const [displayValue, setDisplayValue] = useState(formatValue(0));

    useEffect(() => {
      motionValue.set(value);
    }, [value, motionValue]);

    useEffect(() => {
      const unsubscribe = springValue.on("change", (latest) => {
        setDisplayValue(formatValue(latest));
      });
      return unsubscribe;
    }, [springValue, formatValue]);

    return (
      <span className={cn("tabular-nums", className)}>{displayValue}</span>
    );
  }
);

AnimatedCounter.displayName = "AnimatedCounter";

// ============================================================================
// SKELETON SHIMMER
// ============================================================================

interface ShimmerProps {
  className?: string;
  children?: React.ReactNode;
}

export const Shimmer = memo<ShimmerProps>(({ className, children }) => (
  <div
    className={cn(
      "relative overflow-hidden bg-coffee-100 dark:bg-coffee-800",
      "before:absolute before:inset-0",
      "before:translate-x-[-100%]",
      "before:animate-[shimmer_1.5s_infinite]",
      "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
      className
    )}
    aria-hidden="true"
  >
    {children}
  </div>
));

Shimmer.displayName = "Shimmer";

// ============================================================================
// TYPING INDICATOR
// ============================================================================

interface TypingIndicatorProps {
  className?: string;
}

export const TypingIndicator = memo<TypingIndicatorProps>(({ className }) => (
  <div
    className={cn("flex items-center gap-1 p-2", className)}
    aria-label="Typing"
  >
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-2 h-2 bg-coffee-400 rounded-full"
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.15,
        }}
      />
    ))}
  </div>
));

TypingIndicator.displayName = "TypingIndicator";

// ============================================================================
// EMPTY STATE
// ============================================================================

interface EmptyStateEnhancedProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyStateEnhanced = memo<EmptyStateEnhancedProps>(
  ({ icon, title, description, action, className }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 md:p-12",
        className
      )}
    >
      {icon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-6 p-4 bg-coffee-100 dark:bg-coffee-800 rounded-full"
        >
          {icon}
        </motion.div>
      )}
      <h3 className="text-xl font-serif font-bold text-coffee-900 dark:text-white mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-coffee-500 dark:text-coffee-400 max-w-md mb-6">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </motion.div>
  )
);

EmptyStateEnhanced.displayName = "EmptyStateEnhanced";
