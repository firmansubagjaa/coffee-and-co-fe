import { useEffect, useCallback } from "react";

type KeyHandler = (event: KeyboardEvent) => void;

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  handler: KeyHandler;
  description?: string;
}

// Hook for keyboard shortcuts
export const useKeyboardShortcut = (
  shortcuts: KeyboardShortcut | KeyboardShortcut[],
  enabled: boolean = true
) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const shortcutList = Array.isArray(shortcuts) ? shortcuts : [shortcuts];

      for (const shortcut of shortcutList) {
        const {
          key,
          ctrlKey = false,
          shiftKey = false,
          altKey = false,
          metaKey = false,
          handler,
        } = shortcut;

        const isMatch =
          event.key.toLowerCase() === key.toLowerCase() &&
          event.ctrlKey === ctrlKey &&
          event.shiftKey === shiftKey &&
          event.altKey === altKey &&
          event.metaKey === metaKey;

        if (isMatch) {
          event.preventDefault();
          handler(event);
          break;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    if (enabled) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, enabled]);
};

// Hook for escape key (common pattern)
export const useEscapeKey = (handler: () => void, enabled: boolean = true) => {
  useKeyboardShortcut(
    {
      key: "Escape",
      handler,
    },
    enabled
  );
};

// Hook for focus trap
export const useFocusTrap = (
  containerRef: React.RefObject<HTMLElement>,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    firstElement.focus();

    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [containerRef, enabled]);
};

// Hook for arrow key navigation in lists
export const useArrowNavigation = (
  itemsRef: React.RefObject<HTMLElement[]>,
  options?: {
    vertical?: boolean;
    horizontal?: boolean;
    wrap?: boolean;
    onSelect?: (index: number) => void;
  }
) => {
  const {
    vertical = true,
    horizontal = false,
    wrap = true,
    onSelect,
  } = options || {};

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const items = itemsRef.current;
      if (!items || items.length === 0) return;

      const currentIndex = items.findIndex(
        (item) => item === document.activeElement
      );
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      if (vertical && event.key === "ArrowDown") {
        nextIndex = wrap
          ? (currentIndex + 1) % items.length
          : Math.min(currentIndex + 1, items.length - 1);
      } else if (vertical && event.key === "ArrowUp") {
        nextIndex = wrap
          ? (currentIndex - 1 + items.length) % items.length
          : Math.max(currentIndex - 1, 0);
      } else if (horizontal && event.key === "ArrowRight") {
        nextIndex = wrap
          ? (currentIndex + 1) % items.length
          : Math.min(currentIndex + 1, items.length - 1);
      } else if (horizontal && event.key === "ArrowLeft") {
        nextIndex = wrap
          ? (currentIndex - 1 + items.length) % items.length
          : Math.max(currentIndex - 1, 0);
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect?.(currentIndex);
        return;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = items.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      items[nextIndex]?.focus();
    },
    [itemsRef, vertical, horizontal, wrap, onSelect]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
};

// Skip to content link (for accessibility)
export const SkipToContent: React.FC<{ contentId?: string }> = ({
  contentId = "main-content",
}) => (
  <a
    href={`#${contentId}`}
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-coffee-900 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-400"
  >
    Skip to main content
  </a>
);

// Announce screen reader messages
export const announce = (
  message: string,
  priority: "polite" | "assertive" = "polite"
) => {
  const announcer = document.createElement("div");
  announcer.setAttribute("role", "status");
  announcer.setAttribute("aria-live", priority);
  announcer.setAttribute("aria-atomic", "true");
  announcer.className = "sr-only";
  announcer.textContent = message;
  document.body.appendChild(announcer);

  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
};
