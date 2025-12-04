import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

// Store scroll positions by pathname
const scrollPositions = new Map<string, number>();

/**
 * Hook to restore scroll position on navigation
 * - Scrolls to top on new page navigation
 * - Restores previous position on back/forward navigation
 */
export const useScrollRestoration = () => {
  const location = useLocation();

  // Save scroll position before navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      scrollPositions.set(location.pathname, window.scrollY);
    };

    // Save on route change
    return () => {
      scrollPositions.set(location.pathname, window.scrollY);
    };
  }, [location.pathname]);

  // Restore or reset scroll on navigation
  useLayoutEffect(() => {
    const savedPosition = scrollPositions.get(location.pathname);

    // Check if this is a back/forward navigation
    const isHistoryNavigation = window.history.state?.usr?.scroll !== undefined;

    if (savedPosition !== undefined && isHistoryNavigation) {
      // Restore saved position for back/forward
      window.scrollTo(0, savedPosition);
    } else {
      // Scroll to top for new navigation
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);
};

/**
 * Hook to scroll to top on route change
 * Simple version without restoration
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [pathname]);
};

/**
 * Hook to scroll to element by hash
 */
export const useHashScroll = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [hash]);
};

/**
 * Component version of scroll to top
 */
export const ScrollToTop: React.FC = () => {
  useScrollToTop();
  return null;
};

/**
 * Scroll to element with offset (for fixed headers)
 */
export const scrollToElement = (elementId: string, offset: number = 80) => {
  const element = document.getElementById(elementId);
  if (element) {
    const y = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
};

/**
 * Smooth scroll to top
 */
export const scrollToTop = (behavior: ScrollBehavior = "smooth") => {
  window.scrollTo({ top: 0, behavior });
};
