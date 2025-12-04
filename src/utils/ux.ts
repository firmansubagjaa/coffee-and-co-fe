/**
 * UX Utilities
 *
 * Comprehensive utilities for improving user experience:
 * - Haptic feedback simulation
 * - Sound effects
 * - Scroll behaviors
 * - Copy to clipboard
 * - Form helpers
 * - Animation presets for micro-interactions
 */

// ============================================================================
// HAPTIC FEEDBACK (Vibration API)
// ============================================================================

/**
 * Trigger haptic feedback if supported
 */
export const haptic = {
  /** Light tap feedback */
  light: () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(10);
    }
  },
  /** Medium feedback for confirmations */
  medium: () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(25);
    }
  },
  /** Heavy feedback for important actions */
  heavy: () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }
  },
  /** Success pattern */
  success: () => {
    if ("vibrate" in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  },
  /** Error pattern */
  error: () => {
    if ("vibrate" in navigator) {
      navigator.vibrate([50, 30, 50, 30, 50]);
    }
  },
  /** Custom pattern */
  pattern: (pattern: number[]) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  },
};

// ============================================================================
// MICRO-INTERACTION VARIANTS (for Framer Motion)
// ============================================================================

export const microInteractions = {
  /** Button press effect */
  buttonTap: {
    scale: 0.97,
    transition: { duration: 0.1 },
  },

  /** Button hover effect */
  buttonHover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },

  /** Card hover lift effect */
  cardHover: {
    y: -4,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3 },
  },

  /** Icon bounce effect */
  iconBounce: {
    scale: [1, 1.3, 1],
    rotate: [0, -10, 10, 0],
    transition: { duration: 0.4 },
  },

  /** Pulse effect for notifications */
  pulse: {
    scale: [1, 1.05, 1],
    transition: { duration: 0.3, repeat: 2 },
  },

  /** Shake effect for errors */
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 },
  },

  /** Pop effect for success */
  pop: {
    scale: [0, 1.2, 1],
    opacity: [0, 1, 1],
    transition: { duration: 0.3 },
  },

  /** Slide in from right */
  slideInRight: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },

  /** Slide in from bottom */
  slideInUp: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 },
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },

  /** Fade scale effect */
  fadeScale: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
    transition: { duration: 0.2 },
  },

  /** Stagger children animation */
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  },

  /** Stagger child item */
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  },
};

// ============================================================================
// SCROLL BEHAVIORS
// ============================================================================

/**
 * Smooth scroll to element
 */
export function scrollToElement(
  elementId: string,
  options: ScrollIntoViewOptions = { behavior: "smooth", block: "start" }
): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView(options);
  }
}

/**
 * Smooth scroll to top
 */
export function scrollToTop(behavior: ScrollBehavior = "smooth"): void {
  window.scrollTo({ top: 0, behavior });
}

/**
 * Lock body scroll (for modals)
 */
export function lockScroll(): void {
  const scrollY = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = "100%";
  document.body.style.overflow = "hidden";
}

/**
 * Unlock body scroll
 */
export function unlockScroll(): void {
  const scrollY = document.body.style.top;
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  document.body.style.overflow = "";
  window.scrollTo(0, parseInt(scrollY || "0") * -1);
}

// ============================================================================
// CLIPBOARD
// ============================================================================

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// FORM HELPERS
// ============================================================================

/**
 * Shake form element on error
 */
export function shakeElement(element: HTMLElement): void {
  element.classList.add("animate-shake");
  setTimeout(() => {
    element.classList.remove("animate-shake");
  }, 500);
}

/**
 * Focus first invalid form field
 */
export function focusFirstError(form: HTMLFormElement): void {
  const firstInvalid = form.querySelector(":invalid") as HTMLElement;
  if (firstInvalid) {
    firstInvalid.focus();
    firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// ============================================================================
// NUMBER FORMATTING
// ============================================================================

/**
 * Format number with animation-friendly increments
 */
export function animateNumber(
  start: number,
  end: number,
  duration: number,
  callback: (value: number) => void
): void {
  const startTime = performance.now();
  const difference = end - start;

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const value = start + difference * easeProgress;

    callback(value);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

/**
 * Format currency for display
 */
export function formatCurrency(
  amount: number,
  currency = "USD",
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format number with compact notation
 */
export function formatCompact(value: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

// ============================================================================
// TIME UTILITIES
// ============================================================================

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string, locale = "en"): string {
  const now = new Date();
  const target = typeof date === "string" ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (diffInSeconds < 60) return rtf.format(-diffInSeconds, "second");
  if (diffInSeconds < 3600)
    return rtf.format(-Math.floor(diffInSeconds / 60), "minute");
  if (diffInSeconds < 86400)
    return rtf.format(-Math.floor(diffInSeconds / 3600), "hour");
  if (diffInSeconds < 604800)
    return rtf.format(-Math.floor(diffInSeconds / 86400), "day");
  if (diffInSeconds < 2592000)
    return rtf.format(-Math.floor(diffInSeconds / 604800), "week");
  if (diffInSeconds < 31536000)
    return rtf.format(-Math.floor(diffInSeconds / 2592000), "month");
  return rtf.format(-Math.floor(diffInSeconds / 31536000), "year");
}

// ============================================================================
// LOADING STATES
// ============================================================================

/**
 * Delay execution (useful for minimum loading states)
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Minimum loading time wrapper
 */
export async function withMinimumLoadingTime<T>(
  promise: Promise<T>,
  minimumMs = 500
): Promise<T> {
  const [result] = await Promise.all([promise, delay(minimumMs)]);
  return result;
}

// ============================================================================
// OPTIMISTIC UPDATES
// ============================================================================

/**
 * Create an optimistic update handler
 */
export function createOptimisticUpdate<T>(
  currentState: T,
  optimisticState: T,
  setState: (state: T) => void
): {
  apply: () => void;
  revert: () => void;
  confirm: () => void;
} {
  return {
    apply: () => setState(optimisticState),
    revert: () => setState(currentState),
    confirm: () => {}, // Keep optimistic state
  };
}

// ============================================================================
// CSS CLASS HELPERS
// ============================================================================

/**
 * Animation delay classes for staggered animations
 */
export const staggerDelays = {
  1: "animation-delay-100",
  2: "animation-delay-200",
  3: "animation-delay-300",
  4: "animation-delay-400",
  5: "animation-delay-500",
};

/**
 * Get stagger delay class for index
 */
export function getStaggerDelay(index: number, baseDelay = 50): string {
  return `animation-delay-[${index * baseDelay}ms]`;
}
