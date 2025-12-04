/**
 * Performance Utilities
 *
 * Comprehensive utilities for optimizing React application performance:
 * - Debounce & Throttle functions
 * - Memoization helpers
 * - Virtual list utilities
 * - Performance monitoring
 * - React hooks for optimization
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ============================================================================
// DEBOUNCE & THROTTLE
// ============================================================================

/**
 * Creates a debounced function that delays invoking func until after wait
 * milliseconds have elapsed since the last time the debounced function was invoked.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean; maxWait?: number } = {}
): T & { cancel: () => void; flush: () => void } {
  const { leading = false, trailing = true, maxWait } = options;

  let timeout: ReturnType<typeof setTimeout> | null = null;
  let maxTimeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastCallTime: number | undefined;
  let result: ReturnType<T>;

  const invokeFunc = () => {
    if (lastArgs) {
      result = func(...lastArgs) as ReturnType<T>;
      lastArgs = null;
    }
  };

  const debounced = function (...args: Parameters<T>) {
    lastArgs = args;
    const now = Date.now();

    if (lastCallTime === undefined && leading) {
      invokeFunc();
    }

    lastCallTime = now;

    if (timeout) {
      clearTimeout(timeout);
    }

    if (trailing) {
      timeout = setTimeout(() => {
        invokeFunc();
        timeout = null;
        if (maxTimeout) {
          clearTimeout(maxTimeout);
          maxTimeout = null;
        }
      }, wait);
    }

    if (maxWait !== undefined && !maxTimeout) {
      maxTimeout = setTimeout(() => {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        invokeFunc();
        maxTimeout = null;
      }, maxWait);
    }

    return result;
  } as T & { cancel: () => void; flush: () => void };

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (maxTimeout) {
      clearTimeout(maxTimeout);
      maxTimeout = null;
    }
    lastArgs = null;
    lastCallTime = undefined;
  };

  debounced.flush = () => {
    if (timeout || maxTimeout) {
      invokeFunc();
      debounced.cancel();
    }
  };

  return debounced;
}

/**
 * Creates a throttled function that only invokes func at most once per every
 * wait milliseconds.
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): T & { cancel: () => void } {
  const { leading = true, trailing = true } = options;

  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastCallTime = 0;
  let result: ReturnType<T>;

  const throttled = function (...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - lastCallTime);

    lastArgs = args;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastCallTime = now;
      if (leading || lastCallTime !== 0) {
        result = func(...args) as ReturnType<T>;
        lastArgs = null;
      }
    } else if (!timeout && trailing) {
      timeout = setTimeout(() => {
        lastCallTime = leading ? Date.now() : 0;
        timeout = null;
        if (lastArgs) {
          result = func(...lastArgs) as ReturnType<T>;
          lastArgs = null;
        }
      }, remaining);
    }

    return result;
  } as T & { cancel: () => void };

  throttled.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    lastCallTime = 0;
    lastArgs = null;
  };

  return throttled;
}

// ============================================================================
// MEMOIZATION
// ============================================================================

/**
 * Simple memoization function with configurable cache size
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  func: T,
  options: {
    maxSize?: number;
    keyResolver?: (...args: Parameters<T>) => string;
  } = {}
): T & { cache: Map<string, ReturnType<T>>; clear: () => void } {
  const { maxSize = 100, keyResolver } = options;
  const cache = new Map<string, ReturnType<T>>();

  const memoized = function (...args: Parameters<T>): ReturnType<T> {
    const key = keyResolver ? keyResolver(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args) as ReturnType<T>;

    // LRU-like behavior: remove oldest entry if cache is full
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    cache.set(key, result);
    return result;
  } as T & { cache: Map<string, ReturnType<T>>; clear: () => void };

  memoized.cache = cache;
  memoized.clear = () => cache.clear();

  return memoized;
}

/**
 * Deep comparison function for memoization
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;

  if (typeof a === "object") {
    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;

    const keysA = Object.keys(aObj);
    const keysB = Object.keys(bObj);

    if (keysA.length !== keysB.length) return false;

    return keysA.every((key) => deepEqual(aObj[key], bObj[key]));
  }

  return false;
}

// ============================================================================
// REACT HOOKS
// ============================================================================

/**
 * useDebounce - Returns a debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * useDebouncedCallback - Returns a debounced callback function
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T & { cancel: () => void; flush: () => void } {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFn = useMemo(
    () => debounce(callback, delay),
    [delay, ...deps]
  );

  useEffect(() => {
    return () => {
      debouncedFn.cancel();
    };
  }, [debouncedFn]);

  return debouncedFn;
}

/**
 * useThrottledCallback - Returns a throttled callback function
 */
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T & { cancel: () => void } {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledFn = useMemo(
    () => throttle(callback, delay),
    [delay, ...deps]
  );

  useEffect(() => {
    return () => {
      throttledFn.cancel();
    };
  }, [throttledFn]);

  return throttledFn;
}

/**
 * usePrevious - Returns the previous value of a variable
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * useDeepMemo - useMemo with deep comparison
 */
export function useDeepMemo<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  const ref = useRef<{ deps: React.DependencyList; value: T } | null>(null);

  if (
    !ref.current ||
    !deps.every((dep, i) => deepEqual(dep, ref.current!.deps[i]))
  ) {
    ref.current = { deps, value: factory() };
  }

  return ref.current.value;
}

/**
 * useStableCallback - Returns a stable callback that always calls the latest version
 */
export function useStableCallback<T extends (...args: unknown[]) => unknown>(
  callback: T
): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(((...args) => callbackRef.current(...args)) as T, []);
}

/**
 * useUpdateEffect - useEffect that skips the first render
 */
export function useUpdateEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList
): void {
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ============================================================================
// INTERSECTION OBSERVER
// ============================================================================

interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  freezeOnceVisible?: boolean;
}

/**
 * useIntersectionObserver - Tracks element visibility
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): [React.RefObject<HTMLElement>, boolean] {
  const {
    root = null,
    rootMargin = "0px",
    threshold = 0,
    freezeOnceVisible = false,
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const frozen = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || frozen.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);

        if (visible && freezeOnceVisible) {
          frozen.current = true;
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [root, rootMargin, threshold, freezeOnceVisible]);

  return [elementRef as React.RefObject<HTMLElement>, isVisible];
}

// ============================================================================
// VIRTUAL LIST
// ============================================================================

interface UseVirtualListOptions<T> {
  items: T[];
  itemHeight: number;
  overscan?: number;
}

interface VirtualItem<T> {
  item: T;
  index: number;
  style: React.CSSProperties;
}

/**
 * useVirtualList - Virtualizes a large list for performance
 */
export function useVirtualList<T>(options: UseVirtualListOptions<T>): {
  containerRef: React.RefObject<HTMLDivElement>;
  virtualItems: VirtualItem<T>[];
  totalHeight: number;
} {
  const { items, itemHeight, overscan = 5 } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    const handleResize = () => {
      setContainerHeight(container.clientHeight);
    };

    handleResize();

    container.addEventListener("scroll", handleScroll, { passive: true });
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, []);

  const virtualItems = useMemo(() => {
    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - overscan
    );
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const result: VirtualItem<T>[] = [];

    for (let i = startIndex; i <= endIndex; i++) {
      result.push({
        item: items[i],
        index: i,
        style: {
          position: "absolute",
          top: i * itemHeight,
          height: itemHeight,
          left: 0,
          right: 0,
        },
      });
    }

    return result;
  }, [items, itemHeight, overscan, scrollTop, containerHeight]);

  const totalHeight = items.length * itemHeight;

  return { containerRef, virtualItems, totalHeight };
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
}

/**
 * useRenderCount - Tracks component render count (for debugging)
 */
export function useRenderCount(): number {
  const renderCount = useRef(0);
  renderCount.current += 1;
  return renderCount.current;
}

/**
 * usePerformanceMonitor - Monitors component performance (for debugging)
 */
export function usePerformanceMonitor(
  componentName: string
): PerformanceMetrics {
  const renderCount = useRef(0);
  const renderTimes = useRef<number[]>([]);
  const lastRenderStart = useRef(performance.now());

  useEffect(() => {
    const renderTime = performance.now() - lastRenderStart.current;
    renderTimes.current.push(renderTime);
    renderCount.current += 1;

    if (process.env.NODE_ENV === "development") {
      console.log(`[Performance] ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
  });

  lastRenderStart.current = performance.now();

  return {
    renderCount: renderCount.current,
    lastRenderTime: renderTimes.current[renderTimes.current.length - 1] || 0,
    averageRenderTime:
      renderTimes.current.reduce((a, b) => a + b, 0) /
        renderTimes.current.length || 0,
  };
}

/**
 * measurePerformance - Measures execution time of a function
 */
export async function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();

  if (process.env.NODE_ENV === "development") {
    console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
  }

  return result;
}

// ============================================================================
// REQUEST IDLE CALLBACK
// ============================================================================

type IdleCallbackHandle = number;

/**
 * requestIdleCallback polyfill
 */
export const requestIdleCallbackPolyfill =
  typeof window !== "undefined" && "requestIdleCallback" in window
    ? window.requestIdleCallback
    : (cb: IdleRequestCallback): IdleCallbackHandle =>
        window.setTimeout(
          () => cb({ didTimeout: false, timeRemaining: () => 50 }),
          1
        );

export const cancelIdleCallbackPolyfill =
  typeof window !== "undefined" && "cancelIdleCallback" in window
    ? window.cancelIdleCallback
    : (handle: IdleCallbackHandle): void => window.clearTimeout(handle);

/**
 * useIdleCallback - Runs callback during browser idle time
 */
export function useIdleCallback(
  callback: () => void,
  options: { timeout?: number } = {}
): void {
  const { timeout = 1000 } = options;

  useEffect(() => {
    const handle = requestIdleCallbackPolyfill(callback, { timeout });
    return () => cancelIdleCallbackPolyfill(handle);
  }, [callback, timeout]);
}

// ============================================================================
// LAZY INITIALIZATION
// ============================================================================

/**
 * useLazyRef - Lazy initialization for refs
 */
export function useLazyRef<T>(initializer: () => T): React.MutableRefObject<T> {
  const ref = useRef<T | null>(null);

  if (ref.current === null) {
    ref.current = initializer();
  }

  return ref as React.MutableRefObject<T>;
}

/**
 * useConst - Creates a constant value that never changes
 */
export function useConst<T>(initializer: T | (() => T)): T {
  const ref = useRef<{ value: T } | undefined>(undefined);

  if (ref.current === undefined) {
    ref.current = {
      value:
        typeof initializer === "function"
          ? (initializer as () => T)()
          : initializer,
    };
  }

  return ref.current.value;
}

// ============================================================================
// CLEANUP UTILITIES
// ============================================================================

/**
 * Cleanup performance utilities
 */
export function cleanupPerformance(): void {
  // Clear any global caches or observers if needed
  if (process.env.NODE_ENV === "development") {
    console.log("[Performance] Cleanup completed");
  }
}
