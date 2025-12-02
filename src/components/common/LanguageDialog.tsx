import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, Globe } from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

interface LanguageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LanguageDialog: React.FC<LanguageDialogProps> = ({ open, onOpenChange }) => {
  const { language, setLanguage, t } = useLanguage();

  const handleSelect = (lang: 'en' | 'id') => {
    setLanguage(lang);
    // Optional: Close after selection or keep open to show selection
    setTimeout(() => onOpenChange(false), 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-coffee-900 border-coffee-100 dark:border-coffee-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif font-bold text-center text-coffee-900 dark:text-white flex items-center justify-center gap-2">
            <Globe className="w-6 h-6 text-coffee-600 dark:text-coffee-400" />
            {t('languageDialog.title')}
          </DialogTitle>
          <DialogDescription className="text-center text-coffee-600 dark:text-coffee-300">
            {t('languageDialog.subtitle')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Bahasa Indonesia - Main Option */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect('id')}
            className={cn(
              "relative flex items-center p-4 rounded-xl border-2 transition-all",
              language === 'id' 
                ? "border-coffee-600 bg-coffee-50 dark:bg-coffee-800/50 dark:border-coffee-400" 
                : "border-gray-100 dark:border-coffee-800 hover:border-coffee-200 dark:hover:border-coffee-700"
            )}
          >
            <div className="h-10 w-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-2xl shadow-sm mr-4">
              🇮🇩
            </div>
            <div className="flex-1 text-left">
              <h3 className={cn(
                "font-bold text-lg",
                language === 'id' ? "text-coffee-900 dark:text-white" : "text-gray-600 dark:text-gray-300"
              )}>
                {t('languageDialog.indonesian')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('languageDialog.mainLanguage')}</p>
            </div>
            {language === 'id' && (
              <div className="h-6 w-6 bg-coffee-600 dark:bg-coffee-400 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </motion.button>

          {/* English - Secondary Option */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect('en')}
            className={cn(
              "relative flex items-center p-4 rounded-xl border-2 transition-all",
              language === 'en' 
                ? "border-coffee-600 bg-coffee-50 dark:bg-coffee-800/50 dark:border-coffee-400" 
                : "border-gray-100 dark:border-coffee-800 hover:border-coffee-200 dark:hover:border-coffee-700"
            )}
          >
            <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-2xl shadow-sm mr-4">
              🇺🇸
            </div>
            <div className="flex-1 text-left">
              <h3 className={cn(
                "font-bold text-lg",
                language === 'en' ? "text-coffee-900 dark:text-white" : "text-gray-600 dark:text-gray-300"
              )}>
                {t('languageDialog.english')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('languageDialog.international')}</p>
            </div>
            {language === 'en' && (
              <div className="h-6 w-6 bg-coffee-600 dark:bg-coffee-400 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
