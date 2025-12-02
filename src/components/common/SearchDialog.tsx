import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, ArrowRight, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../../services/api';
import { Product } from '@/types';
import { CURRENCY } from '../../utils/constants';

import { useLanguage } from '../../contexts/LanguageContext';

export const SearchDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  // Handle keyboard shortcut (Cmd+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Filter products based on query
  const filteredProducts = React.useMemo(() => {
    if (!query || !products) return [];
    const lowerQuery = query.toLowerCase();
    return products.filter((product: Product) => 
      product.name.toLowerCase().includes(lowerQuery) || 
      product.category.toLowerCase().includes(lowerQuery)
    ).slice(0, 5); // Limit to 5 results
  }, [query, products]);

  const handleSelect = (productId: string) => {
    navigate(`/product/${productId}`);
    setOpen(false);
    setQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 p-2 rounded-full text-coffee-600 hover:bg-white/50 dark:hover:bg-coffee-800 hover:text-coffee-900 dark:hover:text-white transition-colors group">
          <Search className="h-6 w-6" />
          <span className="sr-only md:not-sr-only md:inline-block md:text-sm md:text-coffee-400 group-hover:text-coffee-600 dark:group-hover:text-coffee-300 pr-2">
            {t('common.search')} <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-coffee-200 dark:border-coffee-700 bg-white dark:bg-coffee-800 px-1.5 font-mono text-[10px] font-medium text-coffee-400 opacity-100"><span className="text-xs">⌘</span>K</kbd>
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-cream-50 dark:bg-coffee-900 gap-0 border-coffee-200 dark:border-coffee-800 top-[10%] translate-y-0">
        <DialogHeader className="px-4 py-4 border-b border-coffee-100 dark:border-coffee-800 bg-white dark:bg-coffee-900">
          <DialogTitle className="sr-only">{t('common.search')}</DialogTitle>
          <DialogDescription className="sr-only">{t('common.searchPlaceholder')}</DialogDescription>
          <div className="flex items-center gap-3">
             <Search className="h-5 w-5 text-coffee-400" />
             <input
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-coffee-300 dark:placeholder:text-coffee-600 disabled:cursor-not-allowed disabled:opacity-50 text-coffee-900 dark:text-white"
                placeholder={t('common.searchPlaceholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
             />
          </div>
        </DialogHeader>
        
        <div className="max-h-[300px] overflow-y-auto p-2">
            {query === '' ? (
                <div className="py-10 text-center text-sm text-coffee-400">
                    <p>{t('common.startTyping')}</p>
                </div>
            ) : isLoading ? (
                <div className="py-10 flex justify-center text-coffee-400">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            ) : filteredProducts.length > 0 ? (
                <div className="space-y-1">
                    <h4 className="mb-2 px-2 text-xs font-semibold text-coffee-400 uppercase tracking-wider">{t('dashboard.nav.products')}</h4>
                    <AnimatePresence>
                    {filteredProducts.map((product, index) => (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: index * 0.05 }}
                            key={product.id}
                            onClick={() => handleSelect(product.id)}
                            className="w-full flex items-center gap-3 rounded-lg px-2 py-3 text-left hover:bg-white dark:hover:bg-coffee-800 hover:shadow-sm transition-all group"
                        >
                            <div className="h-10 w-10 rounded-md overflow-hidden bg-coffee-100 dark:bg-coffee-800 shrink-0">
                                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <h3 className="truncate font-medium text-coffee-900 dark:text-white group-hover:text-coffee-700 dark:group-hover:text-coffee-200">{product.name}</h3>
                                <p className="truncate text-xs text-coffee-500 dark:text-coffee-400 capitalize">{product.category}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-coffee-800 dark:text-coffee-200">{CURRENCY}{product.price.toFixed(2)}</span>
                                <ArrowRight className="h-4 w-4 text-coffee-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </div>
                        </motion.button>
                    ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="py-10 text-center text-sm text-coffee-400">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>{t('common.noResults')} "{query}"</p>
                </div>
            )}
        </div>
        
        <div className="border-t border-coffee-100 dark:border-coffee-800 bg-white dark:bg-coffee-900 px-4 py-2 text-xs text-coffee-400 flex justify-between">
            <span>{t('common.pressEsc')}</span>
            {filteredProducts.length > 0 && <span>{filteredProducts.length} {t('common.results')}</span>}
        </div>
      </DialogContent>
    </Dialog>
  );
};