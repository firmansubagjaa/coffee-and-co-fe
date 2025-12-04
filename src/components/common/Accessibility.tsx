/**
 * Accessibility Components
 * Ready-to-use accessible components for common patterns
 */

import React, { useRef, useEffect, forwardRef } from "react";
import { useReducedMotion, announce } from "../../utils/accessibility";
import { cn } from "../../utils/cn";

// ============================================
// SKIP LINK
// ============================================

interface SkipLinkProps {
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({
  href = "#main-content",
  children = "Skip to main content",
  className,
}) => (
  <a
    href={href}
    className={cn(
      "fixed top-0 left-1/2 -translate-x-1/2 -translate-y-full z-[9999]",
      "px-6 py-3 bg-coffee-900 text-white font-semibold rounded-b-lg",
      "focus:translate-y-0 transition-transform duration-200",
      "focus:outline-none focus:ring-2 focus:ring-coffee-400 focus:ring-offset-2",
      className
    )}
  >
    {children}
  </a>
);

// ============================================
// VISUALLY HIDDEN
// ============================================

interface VisuallyHiddenProps {
  children: React.ReactNode;
  as?: React.ElementType;
}

export const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({
  children,
  as: Component = "span",
}) => <Component className="sr-only">{children}</Component>;

// ============================================
// LIVE REGION
// ============================================

interface LiveRegionProps {
  children: React.ReactNode;
  priority?: "polite" | "assertive" | "off";
  atomic?: boolean;
  relevant?:
    | "additions"
    | "removals"
    | "text"
    | "all"
    | "additions text"
    | "additions removals"
    | "removals text"
    | "text additions"
    | "text removals"
    | "removals additions";
  className?: string;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
  children,
  priority = "polite",
  atomic = true,
  relevant = "additions text",
  className,
}) => (
  <div
    role="status"
    aria-live={priority}
    aria-atomic={atomic}
    aria-relevant={relevant}
    className={cn("sr-only", className)}
  >
    {children}
  </div>
);

// ============================================
// FOCUS TRAP
// ============================================

interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
  returnFocus?: boolean;
  initialFocus?: React.RefObject<HTMLElement>;
  className?: string;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  active = true,
  returnFocus = true,
  initialFocus,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    // Save current focus
    previousActiveElement.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    if (!container) return;

    // Focus initial element or first focusable
    const focusTarget =
      initialFocus?.current ||
      container.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

    if (focusTarget) {
      setTimeout(() => focusTarget.focus(), 0);
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusableElements = container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);

      // Restore focus
      if (returnFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [active, returnFocus, initialFocus]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

// ============================================
// ANNOUNCE ON MOUNT
// ============================================

interface AnnounceProps {
  message: string;
  priority?: "polite" | "assertive";
  delay?: number;
}

export const Announce: React.FC<AnnounceProps> = ({
  message,
  priority = "polite",
  delay = 100,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      announce(message, { priority });
    }, delay);

    return () => clearTimeout(timer);
  }, [message, priority, delay]);

  return null;
};

// ============================================
// REDUCED MOTION WRAPPER
// ============================================

interface ReducedMotionProps {
  children: (reducedMotion: boolean) => React.ReactNode;
}

export const ReducedMotion: React.FC<ReducedMotionProps> = ({ children }) => {
  const reducedMotion = useReducedMotion();
  return <>{children(reducedMotion)}</>;
};

// ============================================
// ACCESSIBLE ICON BUTTON
// ============================================

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: React.ReactNode;
  showTooltip?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, icon, showTooltip = true, className, ...props }, ref) => (
    <button
      ref={ref}
      aria-label={label}
      title={showTooltip ? label : undefined}
      className={cn(
        "p-2 rounded-lg transition-colors",
        "hover:bg-coffee-100 dark:hover:bg-coffee-800",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coffee-600",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {icon}
      <VisuallyHidden>{label}</VisuallyHidden>
    </button>
  )
);

IconButton.displayName = "IconButton";

// ============================================
// ACCESSIBLE LOADING STATE
// ============================================

interface LoadingProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  label = "Loading...",
  size = "md",
  className,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div
      role="status"
      aria-label={label}
      className={cn("flex items-center justify-center", className)}
    >
      <svg
        className={cn("animate-spin text-coffee-600", sizeClasses[size])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <VisuallyHidden>{label}</VisuallyHidden>
    </div>
  );
};

// ============================================
// ACCESSIBLE FORM ERROR
// ============================================

interface FormErrorProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({
  id,
  children,
  className,
}) => (
  <p
    id={id}
    role="alert"
    aria-live="polite"
    className={cn("text-sm text-error mt-1", className)}
  >
    {children}
  </p>
);

// ============================================
// ACCESSIBLE PROGRESS BAR
// ============================================

interface ProgressBarProps {
  value: number;
  max?: number;
  label: string;
  showValue?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  className,
}) => {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-coffee-700 dark:text-coffee-300">
          {label}
        </span>
        {showValue && (
          <span className="text-sm text-coffee-600 dark:text-coffee-400">
            {percentage}%
          </span>
        )}
      </div>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className="w-full h-2 bg-coffee-200 dark:bg-coffee-800 rounded-full overflow-hidden"
      >
        <div
          className="h-full bg-coffee-600 dark:bg-coffee-400 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// ============================================
// ACCESSIBLE TABS
// ============================================

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface AccessibleTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

export const AccessibleTabs: React.FC<AccessibleTabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  className,
}) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0]?.id);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    let newIndex = index;

    switch (event.key) {
      case "ArrowRight":
        newIndex = (index + 1) % tabs.length;
        break;
      case "ArrowLeft":
        newIndex = (index - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        newIndex = 0;
        break;
      case "End":
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();

    // Skip disabled tabs
    while (tabs[newIndex]?.disabled && newIndex !== index) {
      newIndex =
        event.key === "ArrowLeft" || event.key === "End"
          ? (newIndex - 1 + tabs.length) % tabs.length
          : (newIndex + 1) % tabs.length;
    }

    tabsRef.current[newIndex]?.focus();
    setActiveTab(tabs[newIndex].id);
    onChange?.(tabs[newIndex].id);
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Tabs"
        className="flex border-b border-coffee-200 dark:border-coffee-700"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabsRef.current[index] = el;
            }}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => {
              setActiveTab(tab.id);
              onChange?.(tab.id);
            }}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "px-4 py-2 font-medium transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coffee-600",
              activeTab === tab.id
                ? "border-b-2 border-coffee-600 text-coffee-900 dark:text-white"
                : "text-coffee-500 hover:text-coffee-700 dark:hover:text-coffee-300",
              tab.disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== tab.id}
          tabIndex={0}
          className="p-4 focus:outline-none"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};
