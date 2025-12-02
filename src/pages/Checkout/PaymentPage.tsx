
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../features/cart/store';
import { useOrderStore } from '../../features/orders/store';
import { Button } from '../../components/common/Button';
import { CURRENCY } from '../../utils/constants';
import { ShieldCheck, Lock, CreditCard, Loader2, Wallet, QrCode, Building, CheckCircle, ChevronRight, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaymentMethod, Order } from '@/types';
import { toast } from 'sonner';
import { useLanguage } from '../../contexts/LanguageContext';

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { total, clearCart, items, checkoutDetails } = useCartStore();
  const { addOrder } = useOrderStore();
  const { t } = useLanguage();
  
  const [step, setStep] = useState<'method' | 'instruction' | 'verifying' | 'success'>('method');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [countdown, setCountdown] = useState(300); // 5 mins for payment simulation

  const amount = total();
  const shippingCost = amount > 30 ? 0 : 5;
  const grandTotal = amount + shippingCost;

  // Protect route
  useEffect(() => {
      if (items.length === 0 && step !== 'success') {
          navigate('/cart');
      }
  }, [items, navigate, step]);

  useEffect(() => {
      if (step === 'instruction' && countdown > 0) {
          const timer = setInterval(() => setCountdown(c => c - 1), 1000);
          return () => clearInterval(timer);
      }
  }, [step, countdown]);

  const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMethodSelect = (method: PaymentMethod) => {
      setSelectedMethod(method);
      setStep('instruction');
  };

  const handleSimulatePayment = () => {
      setStep('verifying');
      
      // Simulate verification delay
      setTimeout(() => {
          setStep('success');
          // Actually create the order in the system
          const newOrder: Order = {
              id: `#ORD-${Math.floor(Math.random() * 1000000)}`,
              userId: '1', // Mock User ID
              items: [...items],
              total: grandTotal,
              status: 'In process',
              date: new Date().toISOString(),
              location: checkoutDetails ? `${checkoutDetails.address}` : 'Store Pickup',
              timeline: [
                  { label: 'Order Placed', date: new Date().toLocaleDateString(), status: 'completed' },
                  { label: 'Payment Verified', date: new Date().toLocaleDateString(), status: 'completed' },
                  { label: 'Processing', date: 'Expected tomorrow', status: 'current' }
              ]
          };
          addOrder(newOrder);
      }, 3000);
  };

  const handleFinish = () => {
      // Create a temporary order object to pass to the Thank You page
      // In a real app, this would come from the backend response
      const orderSummary = {
          id: `#ORD-${Math.floor(Math.random() * 1000000)}`,
          total: grandTotal,
          items: [...items],
          date: new Date().toISOString(),
          location: checkoutDetails ? `${checkoutDetails.address}` : 'Store Pickup',
      };

      clearCart();
      navigate('/thank-you', { state: { order: orderSummary } });
  };

  const renderInstruction = () => {
      if (!selectedMethod) return null;

      switch(selectedMethod) {
          case 'bank_transfer':
              return (
                  <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex items-center justify-between">
                          <div>
                              <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-1">BCA Virtual Account</p>
                              <p className="text-2xl font-mono font-bold text-blue-900 dark:text-blue-100 tracking-widest">8801 2345 6789 000</p>
                          </div>
                          <Button size="sm" variant="ghost" className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40" onClick={() => toast.success(t('checkout.payment.copied'))}>{t('common.copy') || 'Copy'}</Button>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-coffee-400">{t('checkout.payment.instruction.transfer')}</p>
                  </div>
              );
          case 'gopay':
          case 'qris':
              return (
                  <div className="flex flex-col items-center justify-center space-y-4 py-4">
                      <div className="bg-white p-4 rounded-xl border-2 border-gray-100 dark:border-coffee-800 shadow-sm">
                          <QrCode className="w-48 h-48 text-gray-900" />
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{t('checkout.payment.instruction.scan')}</p>
                  </div>
              );
          case 'credit_card':
              return (
                  <div className="space-y-4">
                      <div className="p-4 border rounded-xl bg-gray-50 dark:bg-coffee-800 dark:border-coffee-700">
                          <p className="font-medium text-gray-900 dark:text-white">{t('checkout.payment.mockCard')}</p>
                          <p className="text-xs text-gray-500 dark:text-coffee-400 mt-1">{t('checkout.payment.instruction.card')}</p>
                      </div>
                  </div>
              );
          default:
              return null;
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-coffee-950 flex flex-col items-center justify-center p-4">
      <motion.div 
        layout
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-coffee-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-coffee-800 relative"
      >
        {/* Header - Midtrans Style */}
        <div className="bg-[#002855] p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-400" />
            <div>
                <p className="font-bold tracking-wide text-sm leading-none">{t('checkout.payment.secure')}</p>
                <p className="text-[10px] text-blue-200 mt-0.5">{t('checkout.payment.poweredBy')}</p>
            </div>
          </div>
          <div className="text-right">
              <p className="text-xs text-blue-200 uppercase tracking-wider">{t('checkout.payment.total')}</p>
              <p className="font-bold text-lg leading-none">{CURRENCY}{grandTotal.toFixed(2)}</p>
          </div>
        </div>

        <div className="p-0">
            {step === 'method' && (
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('checkout.payment.title')}</h2>
                    <div className="space-y-3">
                        <button 
                            onClick={() => handleMethodSelect('bank_transfer')}
                            className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-coffee-700 hover:border-[#002855] hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 dark:bg-coffee-800 rounded-lg group-hover:bg-white dark:group-hover:bg-coffee-700 transition-colors">
                                    <Building className="w-5 h-5 text-gray-600 dark:text-coffee-300" />
                                </div>
                                <span className="font-medium text-gray-700 dark:text-coffee-100 group-hover:text-[#002855] dark:group-hover:text-blue-300">{t('checkout.payment.methods.transfer')}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-coffee-600 group-hover:text-[#002855] dark:group-hover:text-blue-300" />
                        </button>

                        <button 
                            onClick={() => handleMethodSelect('gopay')}
                            className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-coffee-700 hover:border-[#002855] hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 dark:bg-coffee-800 rounded-lg group-hover:bg-white dark:group-hover:bg-coffee-700 transition-colors">
                                    <Wallet className="w-5 h-5 text-gray-600 dark:text-coffee-300" />
                                </div>
                                <span className="font-medium text-gray-700 dark:text-coffee-100 group-hover:text-[#002855] dark:group-hover:text-blue-300">{t('checkout.payment.methods.gopay')}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-coffee-600 group-hover:text-[#002855] dark:group-hover:text-blue-300" />
                        </button>

                        <button 
                            onClick={() => handleMethodSelect('qris')}
                            className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-coffee-700 hover:border-[#002855] hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 dark:bg-coffee-800 rounded-lg group-hover:bg-white dark:group-hover:bg-coffee-700 transition-colors">
                                    <QrCode className="w-5 h-5 text-gray-600 dark:text-coffee-300" />
                                </div>
                                <span className="font-medium text-gray-700 dark:text-coffee-100 group-hover:text-[#002855] dark:group-hover:text-blue-300">{t('checkout.payment.methods.qris')}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-coffee-600 group-hover:text-[#002855] dark:group-hover:text-blue-300" />
                        </button>

                        <button 
                            onClick={() => handleMethodSelect('credit_card')}
                            className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-coffee-700 hover:border-[#002855] hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 dark:bg-coffee-800 rounded-lg group-hover:bg-white dark:group-hover:bg-coffee-700 transition-colors">
                                    <CreditCard className="w-5 h-5 text-gray-600 dark:text-coffee-300" />
                                </div>
                                <span className="font-medium text-gray-700 dark:text-coffee-100 group-hover:text-[#002855] dark:group-hover:text-blue-300">{t('checkout.payment.methods.creditCard')}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-coffee-600 group-hover:text-[#002855] dark:group-hover:text-blue-300" />
                        </button>
                    </div>
                </div>
            )}

            {step === 'instruction' && (
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={() => setStep('method')} className="text-sm text-gray-500 dark:text-coffee-400 hover:text-gray-900 dark:hover:text-white font-medium">
                            ← {t('checkout.payment.changeMethod')}
                        </button>
                        <div className="text-right">
                            <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">{t('checkout.payment.expiresIn')}</p>
                            <p className="font-mono text-red-500 font-bold">{formatTime(countdown)}</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        {renderInstruction()}
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl flex gap-3 items-start mb-6">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-yellow-700 dark:text-yellow-200">{t('checkout.payment.instruction.simulation')}</p>
                    </div>

                    <Button fullWidth onClick={handleSimulatePayment} className="bg-[#002855] hover:bg-[#001f40] h-12 shadow-lg">
                        {t('checkout.payment.simulate')}
                    </Button>
                </div>
            )}

            {step === 'verifying' && (
                <div className="p-12 text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-[#002855] rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('checkout.payment.verifying')}</h3>
                    <p className="text-gray-500 dark:text-coffee-400">{t('checkout.payment.doNotClose')}</p>
                </div>
            )}

            {step === 'success' && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 text-center"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('common.success')}</h2>
                    <p className="text-gray-500 dark:text-coffee-400 mb-8">{t('checkout.payment.successDesc')}</p>
                    
                    <Button fullWidth onClick={handleFinish} className="bg-[#002855] hover:bg-[#001f40] h-12 shadow-lg">
                        {t('checkout.payment.return')}
                    </Button>
                </motion.div>
            )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-coffee-950 p-4 border-t border-gray-100 dark:border-coffee-800 flex justify-center items-center gap-4 text-gray-400 dark:text-coffee-600 grayscale opacity-60">
            <CreditCard className="w-5 h-5" />
            <span className="text-[10px] font-bold tracking-widest uppercase">{t('checkout.payment.secureGateway')}</span>
            <Lock className="w-3 h-3" />
        </div>
      </motion.div>
    </div>
  );
};
