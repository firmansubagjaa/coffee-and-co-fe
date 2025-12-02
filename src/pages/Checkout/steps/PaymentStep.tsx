import React, { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { useLanguage } from '../../../contexts/LanguageContext';
import { PaymentMethod } from '@/types';
import { Building, Wallet, QrCode, CreditCard, ChevronRight, CheckCircle } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface PaymentStepProps {
  onNext: (method: PaymentMethod) => void;
  onBack: () => void;
  initialMethod?: PaymentMethod | null;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({ onNext, onBack, initialMethod }) => {
  const { t } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(initialMethod || null);

  const methods = [
    { id: 'bank_transfer', icon: Building, label: t('checkout.payment.methods.transfer') },
    { id: 'gopay', icon: Wallet, label: t('checkout.payment.methods.gopay') },
    { id: 'qris', icon: QrCode, label: t('checkout.payment.methods.qris') },
    { id: 'credit_card', icon: CreditCard, label: t('checkout.payment.methods.creditCard') }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-white dark:bg-coffee-900 rounded-[2rem] p-6 md:p-8 shadow-sm border border-coffee-100 dark:border-coffee-800 mb-6">
        <h2 className="text-2xl font-serif font-bold text-coffee-900 dark:text-white mb-6">{t('checkout.payment.title')}</h2>
        
        <div className="space-y-4">
          {methods.map((method) => (
            <button 
              key={method.id}
              onClick={() => setSelectedMethod(method.id as PaymentMethod)}
              className={cn(
                "w-full flex items-center justify-between p-5 rounded-2xl border transition-all group",
                selectedMethod === method.id 
                  ? "border-coffee-900 dark:border-white bg-coffee-50 dark:bg-coffee-800 ring-1 ring-coffee-900 dark:ring-white" 
                  : "border-coffee-100 dark:border-coffee-700 hover:border-coffee-400 dark:hover:border-coffee-500 hover:bg-coffee-50 dark:hover:bg-coffee-800/50"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-xl transition-colors",
                  selectedMethod === method.id ? "bg-white dark:bg-coffee-700" : "bg-coffee-50 dark:bg-coffee-800"
                )}>
                  <method.icon className="w-6 h-6 text-coffee-900 dark:text-white" />
                </div>
                <span className="font-bold text-lg text-coffee-900 dark:text-white">{method.label}</span>
              </div>
              
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                selectedMethod === method.id ? "border-coffee-900 dark:border-white bg-coffee-900 dark:bg-white" : "border-coffee-200 dark:border-coffee-600"
              )}>
                {selectedMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-white dark:bg-coffee-900" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" size="lg" onClick={onBack} className="px-8">
          {t('common.back')}
        </Button>
        <Button 
          size="lg" 
          onClick={() => selectedMethod && onNext(selectedMethod)} 
          disabled={!selectedMethod}
          className="px-12"
        >
          {t('common.next')}
        </Button>
      </div>
    </div>
  );
};
