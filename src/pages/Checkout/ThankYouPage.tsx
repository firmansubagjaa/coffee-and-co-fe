import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, ArrowRight, Calendar, MapPin, Receipt, Home } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import { CURRENCY } from '../../utils/constants';
import confetti from 'canvas-confetti';
import { SEO } from '@/components/common/SEO';

export const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  // Get order details from navigation state or use mock if missing (for dev/preview)
  const order = location.state?.order || {
    id: `#ORD-${Math.floor(Math.random() * 1000000)}`,
    total: 0,
    items: [],
    date: new Date().toISOString(),
    location: 'Unknown'
  };

  useEffect(() => {
    // Trigger confetti on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-coffee-900 pt-6 pb-20 px-4 relative overflow-hidden">
      <SEO 
        title="Order Confirmed" 
        description="Thank you for your order! We are preparing your coffee with care. Check your order status in your history."
      />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

      <div className="container mx-auto max-w-2xl relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-green-500/30">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <CheckCircle className="w-12 h-12 text-green-400" />
            </motion.div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 tracking-tight">
            {t('thankYou.title')}
          </h1>
          <p className="text-lg text-coffee-200 font-medium">
            {t('thankYou.subtitle')}
          </p>
        </motion.div>

        {/* Receipt Card */}
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", bounce: 0.3, delay: 0.2 }}
          className="bg-white text-coffee-900 rounded-t-3xl shadow-2xl overflow-hidden relative"
        >
            {/* Receipt Header */}
            <div className="bg-coffee-50 p-8 text-center border-b border-dashed border-coffee-200">
                <p className="text-sm font-bold text-coffee-400 uppercase tracking-widest mb-2">Order Receipt</p>
                <p className="text-3xl font-mono font-bold tracking-wider">{order.id}</p>
                <p className="text-sm text-coffee-500 mt-2">{new Date().toLocaleString()}</p>
            </div>

            <div className="p-8">
                {/* Items List */}
                <div className="space-y-4 mb-8">
                    {order.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-start">
                            <div className="flex gap-3">
                                <span className="font-mono font-bold text-coffee-400 w-6">{item.quantity}x</span>
                                <div>
                                    <p className="font-bold text-coffee-900">{item.name}</p>
                                    <p className="text-xs text-coffee-500">Regular Size</p>
                                </div>
                            </div>
                            <p className="font-mono font-bold">{CURRENCY}{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className="border-t-2 border-dashed border-coffee-100 my-6"></div>

                {/* Totals */}
                <div className="space-y-2 mb-8">
                    <div className="flex justify-between text-coffee-600">
                        <span>Subtotal</span>
                        <span className="font-mono">{CURRENCY}{order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-coffee-600">
                        <span>Tax (Included)</span>
                        <span className="font-mono">{CURRENCY}0.00</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-coffee-900 pt-4 border-t border-coffee-100 mt-4">
                        <span>Total Paid</span>
                        <span className="font-mono">{CURRENCY}{order.total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-coffee-50 rounded-xl p-4 flex items-start gap-3 mb-8">
                    <MapPin className="w-5 h-5 text-coffee-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-coffee-900 text-sm mb-1">Delivery Location</p>
                        <p className="text-sm text-coffee-600 leading-relaxed">{order.location}</p>
                    </div>
                </div>

                {/* Barcode Mockup */}
                <div className="flex flex-col items-center justify-center gap-2 opacity-40 mb-2">
                    <div className="h-12 w-full max-w-[200px] bg-coffee-900" style={{ maskImage: 'repeating-linear-gradient(90deg, black, black 2px, transparent 2px, transparent 4px)' }}></div>
                    <p className="font-mono text-xs tracking-[0.5em]">{order.id.replace('#', '')}</p>
                </div>
            </div>

            {/* Jagged Bottom Edge */}
            <div className="h-4 bg-white w-full relative" style={{ 
                backgroundImage: 'linear-gradient(45deg, transparent 75%, #1c1917 75%), linear-gradient(-45deg, transparent 75%, #1c1917 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0'
            }}></div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-10">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => navigate('/menu')}
            className="w-full md:w-auto border-white/20 text-white hover:bg-white/10 hover:text-white"
          >
            <Home className="mr-2 w-4 h-4" />
            {t('thankYou.backToMenu')}
          </Button>
          <Button 
            size="lg" 
            onClick={() => navigate('/history')}
            className="w-full md:w-auto shadow-xl hover:shadow-2xl bg-white text-coffee-900 hover:bg-cream-50"
          >
            {t('thankYou.viewHistory')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

      </div>
    </div>
  );
};
