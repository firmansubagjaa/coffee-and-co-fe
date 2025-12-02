import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, ArrowRight, Calendar, MapPin } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import { CURRENCY } from '../../utils/constants';
import confetti from 'canvas-confetti';

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
    <div className="min-h-screen bg-white dark:bg-coffee-950 pt-20 pb-10 px-4">
      <div className="container mx-auto max-w-3xl">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </motion.div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-coffee-900 dark:text-white mb-4">
            {t('thankYou.title')}
          </h1>
          <p className="text-lg text-coffee-600 dark:text-coffee-300">
            {t('thankYou.subtitle')}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-cream-50 dark:bg-coffee-900 rounded-[2rem] p-6 md:p-8 border border-coffee-100 dark:border-coffee-800 shadow-sm mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-coffee-200 dark:border-coffee-700">
            <div>
              <p className="text-sm text-coffee-500 dark:text-coffee-400 mb-1">{t('thankYou.orderNumber')}</p>
              <p className="text-xl font-mono font-bold text-coffee-900 dark:text-white">{order.id}</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm text-coffee-500 dark:text-coffee-400 mb-1">{t('thankYou.estimatedDelivery')}</p>
              <p className="text-lg font-medium text-coffee-900 dark:text-white flex items-center gap-2 md:justify-end">
                <Calendar className="w-4 h-4" />
                {new Date(Date.now() + 86400000).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-coffee-900 dark:text-white mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              {t('thankYou.items')}
            </h3>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 bg-white dark:bg-coffee-800 p-3 rounded-xl">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-coffee-700 rounded-lg overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-coffee-900 dark:text-white line-clamp-1">{item.name}</p>
                    <p className="text-sm text-coffee-500 dark:text-coffee-400">{t('common.qty')}: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-coffee-900 dark:text-white">{CURRENCY}{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-coffee-200 dark:border-coffee-700">
            <div className="flex items-center gap-2 text-coffee-600 dark:text-coffee-300">
                <MapPin className="w-4 h-4" />
                <span className="text-sm truncate max-w-[150px] md:max-w-xs">{order.location}</span>
            </div>
            <div className="text-right">
              <p className="text-sm text-coffee-500 dark:text-coffee-400">{t('thankYou.total')}</p>
              <p className="text-2xl font-bold text-coffee-900 dark:text-white">{CURRENCY}{order.total.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => navigate('/menu')}
            className="w-full md:w-auto"
          >
            {t('thankYou.backToMenu')}
          </Button>
          <Button 
            size="lg" 
            onClick={() => navigate('/history')}
            className="w-full md:w-auto shadow-lg hover:shadow-xl bg-coffee-600 hover:bg-coffee-700 text-white"
          >
            {t('thankYou.viewHistory')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

      </div>
    </div>
  );
};
