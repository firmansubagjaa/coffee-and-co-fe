import React, { useState, useEffect, useId } from 'react';
import { useFavoritesStore } from '../../features/favorites/store';
import { ProductCard } from '../../features/products/ProductCard';
import { ChevronDown, ChevronUp, SlidersHorizontal, X, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/common/Button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/Breadcrumb";
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { SEO } from '@/components/common/SEO';
import { useLanguage } from '../../contexts/LanguageContext';

// --- Reusing Filter Components (Duplicated for isolation as per KISS) ---

interface FilterSectionProps {
  title: string;
  isOpen?: boolean;
  children: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, isOpen = true, children }) => {
  const [open, setOpen] = useState(isOpen);
  const contentId = useId();
  const triggerId = useId();

  return (
    <div className="border-b border-coffee-100 dark:border-coffee-800 py-4">
      <h3 className="m-0 font-medium">
        <button 
          id={triggerId}
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between text-base font-medium text-coffee-900 dark:text-white hover:text-coffee-600 dark:hover:text-coffee-300 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee-400 focus-visible:ring-offset-2"
          aria-expanded={open}
          aria-controls={contentId}
        >
          <span>{title}</span>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </h3>
      <AnimatePresence>
        {open && (
          <motion.div
            id={contentId}
            role="region"
            aria-labelledby={triggerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-2 space-y-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface CheckboxFilterProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({ label, checked, onChange, id }) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="flex items-center space-x-3">
      <Checkbox 
        id={inputId} 
        checked={checked} 
        onCheckedChange={(c) => onChange(c as boolean)} 
      />
      <Label 
        htmlFor={inputId} 
        className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-coffee-600 dark:text-coffee-300 hover:text-coffee-900 dark:hover:text-white cursor-pointer"
      >
        {label}
      </Label>
    </div>
  );
};

// --- Main Page Component ---

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { items: products } = useFavoritesStore();
  const { t } = useLanguage();

  // State
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  
  // Filters State
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string[]>([]);
  
  // Filter Logic
  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const togglePrice = (range: string) => {
    setPriceRange(prev => 
      prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
    );
  };

  // Derived Products
  const filteredProducts = React.useMemo(() => {
    if (!products) return [];

    let result = [...products];

    // Filter by Category
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Filter by Price (Mock Logic)
    if (priceRange.length > 0) {
        result = result.filter(p => {
            if (priceRange.includes('under-5') && p.price < 5) return true;
            if (priceRange.includes('5-10') && p.price >= 5 && p.price <= 10) return true;
            return false;
        });
    }

    // Sort
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'newest') result.reverse(); // Mock newest

    return result;
  }, [products, selectedCategories, priceRange, sortBy]);

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (isMobileFiltersOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileFiltersOpen]);

  return (
    <div className="min-h-screen bg-white dark:bg-coffee-950 pt-4 pb-20">
      <SEO 
        title="My Favorites" 
        description="Your personalized coffee collection. Quickly access your most-loved drinks and pastries for a faster, easier ordering experience."
      />
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink to="/">{t('nav.home')}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t('favorites.title')}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header - Aligned top offset with MenuPage */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 sticky top-[120px] z-30 bg-white/95 dark:bg-coffee-950/95 backdrop-blur-sm py-4 md:static md:bg-transparent md:py-0">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-white tracking-tight flex items-center gap-3">
             <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            {t('favorites.yourFavorites')} <span className="text-lg text-coffee-400 dark:text-coffee-500 font-sans font-normal ml-2">({filteredProducts.length})</span>
          </h1>

          <div className="flex items-center gap-3">
             {/* Mobile Filter Toggle */}
             <button 
                onClick={() => setIsMobileFiltersOpen(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-coffee-900 border border-coffee-200 dark:border-coffee-700 rounded-full text-sm font-medium text-coffee-900 dark:text-white shadow-sm"
             >
                <SlidersHorizontal className="h-4 w-4" />
                {t('common.filters')}
             </button>

             {/* Sort Dropdown */}
             <div className="w-[180px] relative z-40">
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full h-10 rounded-full bg-white dark:bg-coffee-900 border-coffee-200 dark:border-coffee-700">
                            <div className="flex items-center gap-2">
                            <span className="text-coffee-500 dark:text-coffee-400">{t('common.sort')}:</span>
                            <SelectValue placeholder={t('common.sort')} />
                            </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="featured">{t('menu.sort.featured')}</SelectItem>
                        <SelectItem value="newest">{t('menu.sort.newest')}</SelectItem>
                        <SelectItem value="price-low">{t('menu.sort.priceLow')}</SelectItem>
                        <SelectItem value="price-high">{t('menu.sort.priceHigh')}</SelectItem>
                    </SelectContent>
                </Select>
             </div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
            
            {/* Desktop Sidebar Filters - Aligned sticky top with MenuPage */}
            <aside className="hidden md:block w-64 shrink-0 space-y-2 sticky top-[160px] self-start max-h-[calc(100vh-160px)] overflow-y-auto pr-2 scrollbar-thin">
                <div className="pb-4 border-b border-coffee-200 dark:border-coffee-700 mb-2">
                    <h3 className="font-bold text-lg text-coffee-900 dark:text-white">{t('common.filters')}</h3>
                </div>

                <FilterSection title={t('menu.filters.category')} isOpen>
                    {['coffee', 'pastry', 'merch'].map(cat => (
                        <CheckboxFilter 
                            key={cat}
                            label={t(`menu.categories.${cat}` as any)}
                            checked={selectedCategories.includes(cat)}
                            onChange={() => toggleCategory(cat)}
                        />
                    ))}
                </FilterSection>

                <FilterSection title={t('menu.filters.price')}>
                    <CheckboxFilter 
                        label={t('menu.filters.under5')} 
                        checked={priceRange.includes('under-5')} 
                        onChange={() => togglePrice('under-5')} 
                    />
                    <CheckboxFilter 
                        label={t('menu.filters.5to10')} 
                        checked={priceRange.includes('5-10')} 
                        onChange={() => togglePrice('5-10')} 
                    />
                </FilterSection>
            </aside>

            {/* Product Grid */}
            <main className="flex-1">
                 {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-gradient-to-br from-coffee-50 to-white dark:from-coffee-900 dark:to-coffee-950 rounded-[3rem] text-center px-6 border border-coffee-100 dark:border-coffee-800 shadow-inner relative overflow-hidden">
                        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-28 h-28 bg-white dark:bg-coffee-800 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-coffee-100 dark:shadow-none animate-bounce-slow">
                                <Heart className="h-12 w-12 text-red-400 fill-red-100 dark:fill-red-900/20" />
                            </div>
                            {products.length === 0 ? (
                                 <>
                                    <h3 className="text-4xl font-serif font-bold text-coffee-900 dark:text-white mb-4">{t('favorites.emptyTitle')}</h3>
                                    <p className="text-coffee-600 dark:text-coffee-300 mb-10 max-w-md text-xl leading-relaxed">{t('favorites.emptyDesc')}</p>
                                    <Button size="lg" onClick={() => navigate('/menu')} className="rounded-full px-10 py-6 text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                                        {t('favorites.startBrowsing')}
                                    </Button>
                                 </>
                            ) : (
                                 <>
                                    <h3 className="text-3xl font-bold text-coffee-900 dark:text-white mb-4">{t('favorites.noMatchTitle')}</h3>
                                    <p className="text-coffee-600 dark:text-coffee-300 mb-8 text-lg">{t('favorites.noMatchDesc')}</p>
                                    <button 
                                        onClick={() => { setSelectedCategories([]); setPriceRange([]); }}
                                        className="text-coffee-900 dark:text-white font-bold underline decoration-2 underline-offset-4 hover:text-coffee-600 dark:hover:text-coffee-300 transition-colors text-lg"
                                    >
                                        {t('menu.clearFilters')}
                                    </button>
                                 </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
            <>
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="fixed inset-0 bg-black z-50 md:hidden"
                />
                
                {/* Drawer */}
                <motion.div 
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-y-0 right-0 z-50 w-full sm:w-[350px] bg-white dark:bg-coffee-900 shadow-2xl md:hidden flex flex-col"
                >
                    <div className="flex items-center justify-between p-6 border-b border-coffee-100 dark:border-coffee-800">
                        <h2 className="text-xl font-serif font-bold text-coffee-900 dark:text-white">{t('common.filters')}</h2>
                        <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 hover:bg-coffee-50 dark:hover:bg-coffee-800 rounded-full text-coffee-600 dark:text-coffee-300">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 space-y-2">
                        <FilterSection title={t('menu.filters.category')} isOpen>
                            {['coffee', 'pastry', 'merch'].map(cat => (
                                <CheckboxFilter 
                                    key={cat}
                                    label={t(`menu.categories.${cat}` as any)}
                                    checked={selectedCategories.includes(cat)}
                                    onChange={() => toggleCategory(cat)}
                                />
                            ))}
                        </FilterSection>

                        <FilterSection title={t('menu.filters.price')}>
                            <CheckboxFilter 
                                label={t('menu.filters.under5')} 
                                checked={priceRange.includes('under-5')} 
                                onChange={() => togglePrice('under-5')} 
                            />
                            <CheckboxFilter 
                                label={t('menu.filters.5to10')} 
                                checked={priceRange.includes('5-10')} 
                                onChange={() => togglePrice('5-10')} 
                            />
                        </FilterSection>
                    </div>

                    <div className="p-6 border-t border-coffee-100 dark:border-coffee-800 bg-white dark:bg-coffee-900">
                        <button 
                            onClick={() => setIsMobileFiltersOpen(false)}
                            className="w-full py-4 bg-coffee-900 dark:bg-coffee-100 text-white dark:text-coffee-900 rounded-full font-bold shadow-lg active:scale-95 transition-transform"
                        >
                            {t('menu.showResults')} ({filteredProducts.length})
                        </button>
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </div>
  );
};
