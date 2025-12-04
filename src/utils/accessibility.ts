/**
 * Accessibility Utilities
 * Comprehensive accessibility helpers for screen readers, focus management, and motion preferences
 */

import { useEffect, useRef, useCallback, useState } from "react";

// ============================================
// ARIA LIVE REGIONS
// ============================================

type AriaLivePriority = "polite" | "assertive" | "off";

interface LiveRegionOptions {
  priority?: AriaLivePriority;
  timeout?: number;
  atomic?: boolean;
  relevant?: "additions" | "removals" | "text" | "all";
}

// Create a persistent live region for announcements
let liveRegion: HTMLDivElement | null = null;
let assertiveRegion: HTMLDivElement | null = null;

const createLiveRegion = (priority: AriaLivePriority): HTMLDivElement => {
  const region = document.createElement("div");
  region.setAttribute("role", "status");
  region.setAttribute("aria-live", priority);
  region.setAttribute("aria-atomic", "true");
  region.className = "sr-only";
  region.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `;
  document.body.appendChild(region);
  return region;
};

const getLiveRegion = (priority: AriaLivePriority): HTMLDivElement => {
  if (priority === "assertive") {
    if (!assertiveRegion) {
      assertiveRegion = createLiveRegion("assertive");
    }
    return assertiveRegion;
  }
  if (!liveRegion) {
    liveRegion = createLiveRegion("polite");
  }
  return liveRegion;
};

/**
 * Announce a message to screen readers
 * @param message - The message to announce
 * @param options - Configuration options
 */
export const announce = (
  message: string,
  options: LiveRegionOptions = {}
): void => {
  const { priority = "polite", timeout = 100 } = options;
  const region = getLiveRegion(priority);

  // Clear and re-announce to ensure screen readers pick up the change
  region.textContent = "";

  setTimeout(() => {
    region.textContent = message;
  }, timeout);
};

/**
 * Announce politely (non-interrupting)
 */
export const announcePolite = (message: string): void => {
  announce(message, { priority: "polite" });
};

/**
 * Announce assertively (interrupts current speech)
 */
export const announceAssertive = (message: string): void => {
  announce(message, { priority: "assertive" });
};

// Preset announcements for common actions
export const announcements = {
  loading: (item?: string) =>
    announce(item ? `Loading ${item}...` : "Loading...", {
      priority: "polite",
    }),
  loaded: (item?: string) =>
    announce(item ? `${item} loaded` : "Content loaded", {
      priority: "polite",
    }),
  error: (message: string) =>
    announce(`Error: ${message}`, { priority: "assertive" }),
  success: (message: string) => announce(message, { priority: "polite" }),
  itemAdded: (item: string) =>
    announce(`${item} added`, { priority: "polite" }),
  itemRemoved: (item: string) =>
    announce(`${item} removed`, { priority: "polite" }),
  pageChanged: (page: string) =>
    announce(`Navigated to ${page}`, { priority: "polite" }),
  formError: (field: string, error: string) =>
    announce(`${field}: ${error}`, { priority: "assertive" }),
  cartUpdated: (count: number) =>
    announce(
      `Cart updated. ${count} ${count === 1 ? "item" : "items"} in cart`,
      {
        priority: "polite",
      }
    ),
  searchResults: (count: number, query: string) =>
    announce(
      count === 0
        ? `No results found for "${query}"`
        : `${count} ${count === 1 ? "result" : "results"} found for "${query}"`,
      { priority: "polite" }
    ),
  filterApplied: (filter: string) =>
    announce(`Filter applied: ${filter}`, { priority: "polite" }),
  sortChanged: (sort: string) =>
    announce(`Sorted by ${sort}`, { priority: "polite" }),
  modalOpened: (title: string) =>
    announce(`Dialog opened: ${title}`, { priority: "polite" }),
  modalClosed: () => announce("Dialog closed", { priority: "polite" }),
};

// ============================================
// FOCUS MANAGEMENT
// ============================================

/**
 * Focus an element and ensure it's visible
 */
export const focusElement = (
  element: HTMLElement | null,
  options: FocusOptions = {}
): void => {
  if (!element) return;

  // Ensure element is focusable
  if (!element.hasAttribute("tabindex")) {
    element.setAttribute("tabindex", "-1");
  }

  element.focus(options);
  element.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

/**
 * Hook to manage focus when a component mounts
 */
export const useFocusOnMount = (
  ref: React.RefObject<HTMLElement>,
  enabled: boolean = true
): void => {
  useEffect(() => {
    if (enabled && ref.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        focusElement(ref.current);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [ref, enabled]);
};

/**
 * Hook to restore focus when component unmounts
 */
export const useFocusRestore = (): {
  saveFocus: () => void;
  restoreFocus: () => void;
} => {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previousActiveElement.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousActiveElement.current && previousActiveElement.current.focus) {
      previousActiveElement.current.focus();
    }
  }, []);

  return { saveFocus, restoreFocus };
};

/**
 * Hook for managing focus in modals/dialogs
 */
export const useModalFocus = (
  isOpen: boolean,
  containerRef: React.RefObject<HTMLElement>
): void => {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Save current focus
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Focus first focusable element in modal
      const container = containerRef.current;
      if (container) {
        const focusable = container.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable) {
          setTimeout(() => focusable.focus(), 100);
        }
      }
    } else {
      // Restore focus when modal closes
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen, containerRef]);
};

/**
 * Get all focusable elements within a container
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const selector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(", ");

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => {
      // Check if element is visible
      const style = window.getComputedStyle(el);
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        el.offsetParent !== null
      );
    }
  );
};

// ============================================
// REDUCED MOTION
// ============================================

/**
 * Hook to check if user prefers reduced motion
 */
export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return prefersReducedMotion;
};

/**
 * Get animation duration based on reduced motion preference
 */
export const getAnimationDuration = (
  normalDuration: number,
  reducedMotion: boolean
): number => {
  return reducedMotion ? 0 : normalDuration;
};

/**
 * Framer Motion variants that respect reduced motion
 */
export const getMotionVariants = (reducedMotion: boolean) => ({
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: reducedMotion ? 0 : 0.2 },
  },
  slideUp: {
    initial: { opacity: 0, y: reducedMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reducedMotion ? 0 : -20 },
    transition: { duration: reducedMotion ? 0 : 0.3 },
  },
  slideIn: {
    initial: { opacity: 0, x: reducedMotion ? 0 : -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: reducedMotion ? 0 : 20 },
    transition: { duration: reducedMotion ? 0 : 0.3 },
  },
  scale: {
    initial: { opacity: 0, scale: reducedMotion ? 1 : 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: reducedMotion ? 1 : 0.95 },
    transition: { duration: reducedMotion ? 0 : 0.2 },
  },
  none: {
    initial: {},
    animate: {},
    exit: {},
    transition: { duration: 0 },
  },
});

// ============================================
// COLOR CONTRAST & VISIBILITY
// ============================================

/**
 * Hook to check if user prefers high contrast
 */
export const useHighContrast = (): boolean => {
  const [prefersHighContrast, setPrefersHighContrast] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-contrast: more)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-contrast: more)");

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersHighContrast(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersHighContrast;
};

// ============================================
// ROVING TABINDEX
// ============================================

/**
 * Hook for roving tabindex pattern (tab panels, menu bars, etc.)
 */
export const useRovingTabIndex = <T extends HTMLElement>(
  items: T[],
  options?: {
    orientation?: "horizontal" | "vertical" | "both";
    wrap?: boolean;
    onFocusChange?: (index: number) => void;
  }
) => {
  const {
    orientation = "horizontal",
    wrap = true,
    onFocusChange,
  } = options || {};
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const keys: string[] = [];

      if (orientation === "horizontal" || orientation === "both") {
        keys.push("ArrowLeft", "ArrowRight");
      }
      if (orientation === "vertical" || orientation === "both") {
        keys.push("ArrowUp", "ArrowDown");
      }
      keys.push("Home", "End");

      if (!keys.includes(event.key)) return;

      event.preventDefault();

      let newIndex = focusedIndex;

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          newIndex = wrap
            ? (focusedIndex + 1) % items.length
            : Math.min(focusedIndex + 1, items.length - 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          newIndex = wrap
            ? (focusedIndex - 1 + items.length) % items.length
            : Math.max(focusedIndex - 1, 0);
          break;
        case "Home":
          newIndex = 0;
          break;
        case "End":
          newIndex = items.length - 1;
          break;
      }

      if (newIndex !== focusedIndex) {
        setFocusedIndex(newIndex);
        items[newIndex]?.focus();
        onFocusChange?.(newIndex);
      }
    },
    [focusedIndex, items, orientation, wrap, onFocusChange]
  );

  const getTabIndex = useCallback(
    (index: number) => (index === focusedIndex ? 0 : -1),
    [focusedIndex]
  );

  return {
    focusedIndex,
    setFocusedIndex,
    handleKeyDown,
    getTabIndex,
  };
};

// ============================================
// SCREEN READER UTILITIES
// ============================================

/**
 * Generate a unique ID for accessibility purposes
 */
export const generateId = (prefix: string = "a11y"): string => {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Check if an element has visible text
 */
export const hasVisibleText = (element: HTMLElement): boolean => {
  const text = element.textContent?.trim();
  const ariaLabel = element.getAttribute("aria-label");
  const ariaLabelledBy = element.getAttribute("aria-labelledby");
  const title = element.getAttribute("title");

  return Boolean(text || ariaLabel || ariaLabelledBy || title);
};

/**
 * Visually hidden class string (for sr-only content)
 */
export const visuallyHiddenStyles = `
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

// ============================================
// CLEANUP
// ============================================

/**
 * Cleanup live regions on app unmount
 */
export const cleanupA11y = (): void => {
  if (liveRegion) {
    liveRegion.remove();
    liveRegion = null;
  }
  if (assertiveRegion) {
    assertiveRegion.remove();
    assertiveRegion = null;
  }
};
