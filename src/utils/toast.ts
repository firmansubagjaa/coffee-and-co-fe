import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  ShoppingCart,
  Heart,
  Trash2,
  Loader2,
} from "lucide-react";
import React from "react";

// Type definitions
interface ToastOptions {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Success toast
export const showSuccess = (message: string, options?: ToastOptions) => {
  toast.success(message, {
    description: options?.description,
    duration: options?.duration || 4000,
    action: options?.action
      ? {
          label: options.action.label,
          onClick: options.action.onClick,
        }
      : undefined,
  });
};

// Error toast
export const showError = (message: string, options?: ToastOptions) => {
  toast.error(message, {
    description: options?.description,
    duration: options?.duration || 5000,
    action: options?.action
      ? {
          label: options.action.label,
          onClick: options.action.onClick,
        }
      : undefined,
  });
};

// Warning toast
export const showWarning = (message: string, options?: ToastOptions) => {
  toast.warning(message, {
    description: options?.description,
    duration: options?.duration || 4500,
    action: options?.action
      ? {
          label: options.action.label,
          onClick: options.action.onClick,
        }
      : undefined,
  });
};

// Info toast
export const showInfo = (message: string, options?: ToastOptions) => {
  toast.info(message, {
    description: options?.description,
    duration: options?.duration || 4000,
    action: options?.action
      ? {
          label: options.action.label,
          onClick: options.action.onClick,
        }
      : undefined,
  });
};

// Loading toast (returns dismiss function)
export const showLoading = (message: string): string | number => {
  return toast.loading(message);
};

// Promise toast (auto handles loading/success/error)
export const showPromise = <T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: Error) => string);
  }
) => {
  return toast.promise(promise, messages);
};

// Dismiss toast
export const dismissToast = (toastId?: string | number) => {
  if (toastId) {
    toast.dismiss(toastId);
  } else {
    toast.dismiss();
  }
};

// === Specialized toasts for common actions ===

// Cart actions
export const toastAddedToCart = (productName: string) => {
  showSuccess("Added to cart", {
    description: `${productName} has been added to your order.`,
  });
};

export const toastRemovedFromCart = (productName: string) => {
  showInfo("Removed from cart", {
    description: `${productName} has been removed.`,
  });
};

export const toastCartCleared = () => {
  showInfo("Cart cleared", {
    description: "All items have been removed from your cart.",
  });
};

// Favorites actions
export const toastAddedToFavorites = (productName: string) => {
  showSuccess("Added to favorites", {
    description: `${productName} saved to your favorites.`,
  });
};

export const toastRemovedFromFavorites = (productName: string) => {
  showInfo("Removed from favorites", {
    description: `${productName} removed from your favorites.`,
  });
};

// Auth actions
export const toastLoginRequired = () => {
  showWarning("Login required", {
    description: "Please sign in to continue.",
    action: {
      label: "Sign In",
      onClick: () => (window.location.href = "/login"),
    },
  });
};

export const toastLoginSuccess = (name?: string) => {
  showSuccess("Welcome back!", {
    description: name ? `Good to see you, ${name}!` : "You've been signed in.",
  });
};

export const toastLogoutSuccess = () => {
  showInfo("Signed out", {
    description: "You've been successfully signed out.",
  });
};

// Order actions
export const toastOrderPlaced = (orderId: string) => {
  showSuccess("Order placed!", {
    description: `Your order ${orderId} has been confirmed.`,
  });
};

export const toastOrderError = () => {
  showError("Order failed", {
    description: "Something went wrong. Please try again.",
  });
};

// Generic actions
export const toastSaved = () => {
  showSuccess("Saved", {
    description: "Your changes have been saved.",
  });
};

export const toastDeleted = (item?: string) => {
  showInfo("Deleted", {
    description: item ? `${item} has been deleted.` : "Item has been deleted.",
  });
};

export const toastCopied = (what?: string) => {
  showSuccess("Copied!", {
    description: what ? `${what} copied to clipboard.` : "Copied to clipboard.",
  });
};

export const toastNetworkError = () => {
  showError("Connection error", {
    description: "Please check your internet connection and try again.",
  });
};

// Undo toast with callback
export const toastWithUndo = (
  message: string,
  onUndo: () => void,
  options?: { description?: string; duration?: number }
) => {
  toast(message, {
    description: options?.description,
    duration: options?.duration || 5000,
    action: {
      label: "Undo",
      onClick: onUndo,
    },
  });
};
