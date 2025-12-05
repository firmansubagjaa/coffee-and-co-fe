import React, { memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCartStore } from "../../features/cart/store";
import { useCart, useUpdateCartItem, useRemoveCartItem } from "@/api";  // ✅ Backend hooks
import { Button } from "./Button";
import { CURRENCY } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { TRANSITIONS } from "../../utils/animations";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/Tooltip";
import { useLanguage } from "../../contexts/LanguageContext";
import { CartItem } from "../../types";

// Memoized cart item component to prevent unnecessary re-renders
interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  removeLabel: string;
  isUpdating?: boolean;
  isRemoving?: boolean;
}

const CartItemRow: React.FC<CartItemRowProps> = memo(
  ({ item, onUpdateQuantity, onRemove, removeLabel, isUpdating, isRemoving }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`flex gap-4 p-4 bg-white dark:bg-coffee-800 rounded-2xl border border-coffee-100 dark:border-coffee-700 shadow-sm ${
        isRemoving ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <img
        src={item.image}
        alt={item.name}
        className="h-24 w-24 object-cover rounded-2xl bg-coffee-100 dark:bg-coffee-900"
        loading="lazy"
      />
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif font-bold text-coffee-900 dark:text-white text-lg">
            {item.name}
          </h3>
          <p className="text-coffee-500 dark:text-coffee-400">
            {CURRENCY}
            {item.price.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center bg-coffee-50 dark:bg-coffee-900 rounded-full border border-coffee-100 dark:border-coffee-700 p-1">
            <button
              onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-coffee-700 text-coffee-700 dark:text-coffee-300 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
              disabled={item.quantity <= 1 || isUpdating}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-coffee-900 dark:text-white relative">
              {isUpdating ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 border-2 border-coffee-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                item.quantity
              )}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-coffee-700 text-coffee-700 dark:text-coffee-300 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
              disabled={item.quantity >= 99 || isUpdating}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onRemove(item.cartId)}
                className="text-error/50 hover:text-error p-2 hover:bg-error/10 rounded-full transition-colors disabled:opacity-50"
                aria-label="Remove item"
                disabled={isRemoving}
              >
                {isRemoving ? (
                  <div className="w-4 h-4 border-2 border-error/50 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{removeLabel}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </motion.div>
  )
);

CartItemRow.displayName = "CartItemRow";

export const CartDrawer: React.FC = memo(() => {
  const { isOpen, toggleCart } = useCartStore();  // Only UI state from Zustand
  const { data: cartItems = [] } = useCart();  // ✅ Backend/local items
  const updateCartItemMutation = useUpdateCartItem();  // ✅ Backend mutation
  const removeCartItemMutation = useRemoveCartItem();  // ✅ Backend mutation
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Calculate total from cart items
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = useCallback(() => {
    toggleCart();
    navigate("/cart");
  }, [toggleCart, navigate]);

  const handleUpdateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity < 1 || quantity > 99) return; // Enforce limits
      updateCartItemMutation.mutate({ itemId, quantity });
    },
    [updateCartItemMutation]
  );

  const handleRemoveFromCart = useCallback(
    (itemId: string) => {
      removeCartItemMutation.mutate(itemId);
    },
    [removeCartItemMutation]
  );

  // Track pending operations
  const isUpdating = updateCartItemMutation.isPending;
  const isRemoving = removeCartItemMutation.isPending;
  const pendingItemId = updateCartItemMutation.variables?.itemId || removeCartItemMutation.variables;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={TRANSITIONS.spring}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-cream-50 dark:bg-coffee-900 z-[70] shadow-2xl flex flex-col sm:rounded-l-[2.5rem] overflow-hidden border-l border-white/20 dark:border-coffee-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-coffee-200 dark:border-coffee-800">
              <h2 className="text-2xl font-serif font-bold text-coffee-900 dark:text-white">
                {t("cart.drawerTitle")}
              </h2>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleCart}
                    className="p-2 hover:bg-coffee-100 dark:hover:bg-coffee-800 rounded-full text-coffee-700 dark:text-coffee-300 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("cart.closeCart")}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-coffee-400 space-y-4">
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl"
                  >
                    ☕
                  </motion.span>
                  <p className="text-lg">{t("cart.empty")}</p>
                  <Button variant="outline" onClick={toggleCart}>
                    {t("cart.browseMenu")}
                  </Button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveFromCart}
                    removeLabel={t("cart.removeItem")}
                    isUpdating={isUpdating && pendingItemId === item.cartId}
                    isRemoving={isRemoving && pendingItemId === item.cartId}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-8 border-t border-coffee-200 dark:border-coffee-800 bg-white dark:bg-coffee-900 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-coffee-600 dark:text-coffee-400 font-medium">
                    {t("cart.subtotal")}
                  </span>
                  <motion.span
                    key={total}
                    initial={{ scale: 1.2, color: "#CA8A04" }}
                    animate={{ scale: 1, color: "#3E2723" }}
                    className="text-3xl font-serif font-bold text-coffee-900 dark:text-white"
                  >
                    {CURRENCY}
                    {total.toFixed(2)}
                  </motion.span>
                </div>
                <Button
                  fullWidth
                  size="lg"
                  onClick={handleCheckout}
                  className="shadow-lg hover:shadow-xl hover:shadow-coffee-900/20"
                >
                  {t("cart.checkoutBtn")}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

CartDrawer.displayName = "CartDrawer";
