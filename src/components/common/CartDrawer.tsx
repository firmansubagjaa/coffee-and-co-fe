
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCartStore } from '../../features/cart/store';
import { Button } from './Button';
import { CURRENCY } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { TRANSITIONS } from '../../utils/animations';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/Tooltip';

export const CartDrawer: React.FC = () => {
  const { isOpen, toggleCart, items, updateQuantity, removeFromCart, total } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    toggleCart();
    navigate('/cart');
  };

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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={TRANSITIONS.spring}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-cream-50 dark:bg-coffee-900 z-[70] shadow-2xl flex flex-col sm:rounded-l-[2.5rem] overflow-hidden border-l border-white/20 dark:border-coffee-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-coffee-200 dark:border-coffee-800">
              <h2 className="text-2xl font-serif font-bold text-coffee-900 dark:text-white">Your Order</h2>
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
                  <p>Close Cart</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-coffee-400 space-y-4">
                  <motion.span 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl"
                  >
                    ☕
                  </motion.span>
                  <p className="text-lg">Your cart is empty.</p>
                  <Button variant="outline" onClick={toggleCart}>Browse Menu</Button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={item.id} 
                    className="flex gap-4 p-4 bg-white dark:bg-coffee-800 rounded-3xl shadow-sm border border-coffee-50 dark:border-coffee-700"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-24 w-24 object-cover rounded-2xl bg-coffee-100 dark:bg-coffee-900"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-coffee-900 dark:text-white text-lg">{item.name}</h3>
                        <p className="text-coffee-500 dark:text-coffee-400">{CURRENCY}{item.price.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-coffee-50 dark:bg-coffee-900 rounded-full border border-coffee-100 dark:border-coffee-700 p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-coffee-700 text-coffee-700 dark:text-coffee-300 transition-colors shadow-sm disabled:opacity-50"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-coffee-900 dark:text-white">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-coffee-700 text-coffee-700 dark:text-coffee-300 transition-colors shadow-sm"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove Item</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-8 border-t border-coffee-200 dark:border-coffee-800 bg-white dark:bg-coffee-900 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-coffee-600 dark:text-coffee-400 font-medium">Subtotal</span>
                  <motion.span 
                    key={total()}
                    initial={{ scale: 1.2, color: '#CA8A04' }}
                    animate={{ scale: 1, color: '#3E2723' }}
                    className="text-3xl font-serif font-bold text-coffee-900 dark:text-white"
                  >
                    {CURRENCY}{total().toFixed(2)}
                  </motion.span>
                </div>
                <Button 
                    fullWidth 
                    size="lg" 
                    onClick={handleCheckout}
                    className="shadow-lg hover:shadow-xl hover:shadow-coffee-900/20"
                >
                  Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};