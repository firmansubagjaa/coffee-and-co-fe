import React, { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useCartStore } from '../../../features/cart/store';
import { PaymentMethod } from '@/types';
import { MapPin, Phone, Mail, CreditCard, ShoppingBag, AlertTriangle, Loader2 } from 'lucide-react';
import { CURRENCY } from '../../../utils/constants';

interface ReviewStepProps {
  paymentMethod: PaymentMethod | null;
  onBack: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ paymentMethod, onBack, onConfirm, isProcessing }) => {
  const { t } = useLanguage();
  const { items, checkoutDetails, total } = useCartStore();
  
  const subtotal = total();
  const shipping = subtotal > 30 ? 0 : 5;
  const grandTotal = subtotal + shipping;

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-6 mb-8">
        
        {/* Order Summary */}
        <div className="bg-white dark:bg-coffee-900 rounded-[2rem] p-6 md:p-8 shadow-sm border border-coffee-100 dark:border-coffee-800">
          <h2 className="text-xl font-serif font-bold text-coffee-900 dark:text-white mb-6 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            {t('cart.summary')}
          </h2>
          
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-16 h-16 bg-coffee-50 dark:bg-coffee-800 rounded-xl overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-coffee-900 dark:text-white text-sm">{item.name}</p>
                    <p className="font-bold text-coffee-900 dark:text-white text-sm">{CURRENCY}{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <p className="text-xs text-coffee-500 dark:text-coffee-400">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-coffee-100 dark:border-coffee-800 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-coffee-600 dark:text-coffee-300">
              <span>{t('cart.subtotal')}</span>
              <span>{CURRENCY}{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-coffee-600 dark:text-coffee-300">
              <span>{t('cart.shipping')}</span>
              <span>{shipping === 0 ? t('cart.free') : `${CURRENCY}${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-coffee-900 dark:text-white pt-2">
              <span>{t('cart.total')}</span>
              <span>{CURRENCY}{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Details Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-coffee-900 rounded-[2rem] p-6 shadow-sm border border-coffee-100 dark:border-coffee-800">
            <h3 className="font-bold text-coffee-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {t('checkout.address')}
            </h3>
            <div className="text-sm text-coffee-600 dark:text-coffee-300 space-y-1">
              <p className="font-medium text-coffee-900 dark:text-white">{checkoutDetails?.fullName}</p>
              <p>{checkoutDetails?.address}</p>
              <p className="text-xs mt-2 text-coffee-400">{checkoutDetails?.deliveryNote}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-coffee-900 rounded-[2rem] p-6 shadow-sm border border-coffee-100 dark:border-coffee-800">
            <h3 className="font-bold text-coffee-900 dark:text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> {t('checkout.payment.title')}
            </h3>
            <div className="text-sm text-coffee-600 dark:text-coffee-300">
              <p className="capitalize font-medium text-coffee-900 dark:text-white">
                {paymentMethod?.replace('_', ' ')}
              </p>
              <p className="text-xs mt-1 text-coffee-400">Ready to process</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl flex gap-3 items-start border border-yellow-100 dark:border-yellow-900/30">
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700 dark:text-yellow-200 leading-relaxed font-medium">
            {t('checkout.payment.instruction.simulation')}
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" size="lg" onClick={onBack} disabled={isProcessing} className="px-8">
          {t('common.back')}
        </Button>
        <Button 
          size="lg" 
          onClick={onConfirm} 
          disabled={isProcessing}
          className="px-12 min-w-[160px]"
        >
          {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : t('checkout.placeOrder')}
        </Button>
      </div>
    </div>
  );
};
