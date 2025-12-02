
import React, { useState, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, CheckCircle, ChevronRight, ShoppingBag, MapPin, X, Search, LogOut, Heart, HelpCircle, ChevronDown, User, SlidersHorizontal, ChevronUp } from 'lucide-react';
import { CURRENCY } from '../../utils/constants';
import { Button } from '../../components/common/Button';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Badge } from '../../components/ui/badge';
import { useAuthStore } from '../../features/auth/store';
import { useOrderStore } from '../../features/orders/store';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/Breadcrumb";
import { cn } from '../../utils/cn';
import { toast } from 'sonner';
import { Order } from '@/types';
import { SEO } from '@/components/common/SEO';
import { useLanguage } from '../../contexts/LanguageContext';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';

// --- Types & Components ---

type OrderStatusType = 'completed' | 'current' | 'pending';

// --- Filter Components (Reused from MenuPage for consistency) ---

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

const TimelineDot = ({ status }: { status: OrderStatusType }) => {
    if (status === 'completed') {
        return <div className="w-2.5 h-2.5 rounded-full bg-coffee-900 dark:bg-coffee-100 z-10" />;
    }
    if (status === 'current') {
        return (
            <div className="relative z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-yellow-500 animate-ping opacity-75" />
            </div>
        );
    }
    return <div className="w-2.5 h-2.5 rounded-full bg-coffee-200 dark:bg-coffee-700 z-10" />;
};

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
    const isDelivered = order.status === 'Delivered';

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-coffee-900 rounded-[2.5rem] p-6 md:p-8 shadow-lg border border-coffee-100 dark:border-coffee-800 hover:shadow-2xl hover:border-coffee-300 dark:hover:border-coffee-600 hover:-translate-y-1 transition-all duration-500 relative group"
        >
            {/* Close/Action Top Right */}
            <div className="absolute top-6 right-6 z-20">
                 <button className="text-coffee-300 dark:text-coffee-500 hover:text-coffee-900 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-coffee-50 dark:hover:bg-coffee-800">
                    <ChevronRight className="w-5 h-5" />
                 </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* 1. Timeline Section (Left) - Col Span 3 */}
                <div className="hidden lg:flex flex-col md:col-span-3 pt-2 relative">
                    {/* Vertical Line Container */}
                    <div className="absolute left-[5px] top-3 bottom-[calc(100%-80px)] w-0.5 bg-coffee-100 dark:bg-coffee-800 -z-0" />

                    <div className="flex flex-col justify-between h-full gap-6">
                        {order.timeline?.map((step, idx) => (
                            <div key={idx} className="relative flex gap-4 items-start group/step">
                                <div className="mt-1.5 flex flex-col items-center relative z-10">
                                    <TimelineDot status={step.status} />
                                </div>
                                
                                <div className={cn("transition-opacity duration-300", step.status === 'pending' ? "opacity-50" : "opacity-100")}>
                                    <p className={cn(
                                        "font-serif text-sm tracking-wide mb-0.5",
                                        step.status === 'pending' ? "text-coffee-400 dark:text-coffee-500 font-normal" : "text-coffee-900 dark:text-white font-bold"
                                    )}>{step.label}</p>
                                    <p className="text-[10px] text-coffee-400 font-sans tracking-widest uppercase font-medium">{step.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Product Images (Center) - Col Span 5 */}
                <div className="md:col-span-8 lg:col-span-5 flex flex-col justify-center">
                     <div className="flex items-center justify-between mb-6 md:hidden">
                         {/* Mobile Header */}
                        <div>
                            <h3 className="font-serif font-bold text-lg text-coffee-900 dark:text-white">{order.id}</h3>
                            <span className="text-xs text-coffee-500 dark:text-coffee-400 font-medium">{new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        <Badge variant={isDelivered ? "neutral" : "warning"} className="shadow-sm">
                            {order.status}
                        </Badge>
                     </div>

                     {/* Image Grid */}
                     <div className="flex gap-4 items-center overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                        {order.items.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="relative group/image shrink-0">
                                <div className="w-20 h-24 sm:w-24 sm:h-32 md:w-28 md:h-36 rounded-2xl overflow-hidden bg-coffee-50 dark:bg-coffee-800 shadow-inner border border-coffee-100/50 dark:border-coffee-700">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal transform group-hover/image:scale-110 transition-transform duration-500" />
                                </div>
                                {/* Notification Badge for Quantity */}
                                {item.quantity > 1 && (
                                    <div className="absolute -top-2 -right-2 bg-coffee-900 text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white dark:border-coffee-900 shadow-md">
                                        {item.quantity}
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {/* Overflow Counter */}
                        {order.items.length > 3 && (
                            <div className="w-20 h-24 sm:w-24 sm:h-32 md:w-28 md:h-36 rounded-2xl bg-cream-50 dark:bg-coffee-800 flex flex-col items-center justify-center text-coffee-500 dark:text-coffee-300 border border-coffee-100/50 dark:border-coffee-700 hover:bg-coffee-100 dark:hover:bg-coffee-700 transition-colors cursor-pointer shrink-0 group/more">
                                <span className="text-xl font-serif font-bold group-hover/more:scale-110 transition-transform">+{order.items.length - 3}</span>
                                <span className="text-[10px] uppercase tracking-widest mt-1 opacity-60">Items</span>
                            </div>
                        )}
                     </div>
                </div>

                {/* 3. Order Info & Actions (Right) - Col Span 4 */}
                <div className="md:col-span-4 flex flex-col justify-between h-full py-2 pl-4 border-l border-coffee-50 dark:border-coffee-800/50">
                    <div className="hidden md:block text-right">
                        <div className="flex items-center justify-end gap-3 mb-2">
                             <h3 className="font-serif font-bold text-2xl text-coffee-900 dark:text-white tracking-tight">{order.id}</h3>
                             <Badge variant={isDelivered ? "neutral" : "warning"} className="px-3 py-1 rounded-full font-bold shadow-sm">
                                {order.status}
                             </Badge>
                        </div>
                        <p className="text-xs text-coffee-400 font-bold tracking-widest uppercase">{new Date(order.date).toLocaleDateString()}</p>
                    </div>

                    <div className="space-y-8 md:text-right mt-6 md:mt-0">
                        <div className="hidden md:block">
                            <div className="flex items-center justify-end gap-2 mb-2 text-coffee-400">
                                <MapPin className="w-3 h-3" />
                                <p className="text-[10px] font-bold uppercase tracking-widest">Order Location</p>
                            </div>
                            <p className="text-sm text-coffee-700 dark:text-coffee-200 font-medium leading-relaxed max-w-[200px] md:ml-auto">
                                {order.location}
                            </p>
                        </div>

                         <div className="flex items-end justify-between md:justify-end md:gap-6 border-t border-coffee-50 dark:border-coffee-800 pt-6 md:border-0 md:pt-0">
                             <div className="md:hidden">
                                <p className="text-[10px] text-coffee-400 font-bold uppercase tracking-widest mb-1">Total</p>
                                <p className="font-serif font-bold text-xl text-coffee-900 dark:text-white">{CURRENCY}{order.total.toFixed(2)}</p>
                             </div>
                             
                             <div className="hidden md:block text-right">
                                <p className="text-[10px] text-coffee-400 font-bold uppercase tracking-widest mb-1">Total Amount</p>
                                <p className="font-serif font-bold text-2xl text-coffee-900 dark:text-white">{CURRENCY}{order.total.toFixed(2)}</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export const OrderHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  const { orders } = useOrderStore();
  const { t } = useLanguage();
  
  // State
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success("Logged out successfully");
  };

  const toggleStatus = (status: string) => {
    setSelectedStatus(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  // Filter Orders
  const filteredOrders = React.useMemo(() => {
      if (selectedStatus.length === 0) return orders;
      return orders.filter(order => {
          if (selectedStatus.includes('active') && order.status !== 'Delivered' && order.status !== 'Cancelled') return true;
          if (selectedStatus.includes('completed') && order.status === 'Delivered') return true;
          if (selectedStatus.includes('cancelled') && order.status === 'Cancelled') return true;
          return false;
      });
  }, [orders, selectedStatus]);

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
    <div className="min-h-screen bg-cream-50 dark:bg-coffee-950 pt-6 pb-20">
      <SEO 
        title="Order History" 
        description="Track your past orders and reorder your favorites with ease. View detailed receipts and order status in your account history."
      />
      {/* Hero Section */}
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
                <BreadcrumbPage>{t('history.title')}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 sticky top-[120px] z-30 bg-white/95 dark:bg-coffee-950/95 backdrop-blur-sm py-4 md:static md:bg-transparent md:py-0">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-white tracking-tight flex items-center gap-3">
             <Package className="h-8 w-8 text-coffee-600" />
            {t('history.title')} <span className="text-lg text-coffee-400 dark:text-coffee-500 font-sans font-normal ml-2">({filteredOrders.length})</span>
          </h1>

          <div className="flex items-center gap-3">
             {/* Mobile Filter Toggle */}
             <button 
                onClick={() => setIsMobileFiltersOpen(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-coffee-900 border border-coffee-200 dark:border-coffee-700 rounded-full text-sm font-medium text-coffee-900 dark:text-white shadow-sm"
             >
                <SlidersHorizontal className="h-4 w-4" />
                {t('history.filters.title')}
             </button>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
            
            {/* Desktop Sidebar Filters */}
            <aside className="hidden md:block w-64 shrink-0 space-y-2 sticky top-[160px] self-start max-h-[calc(100vh-160px)] overflow-y-auto pr-2 scrollbar-thin">
                <div className="pb-4 border-b border-coffee-200 dark:border-coffee-700 mb-2">
                    <h3 className="font-bold text-lg text-coffee-900 dark:text-white">{t('history.filters.title')}</h3>
                </div>

                <FilterSection title={t('history.filters.status')} isOpen>
                    <CheckboxFilter 
                        label={t('history.filters.active')} 
                        checked={selectedStatus.includes('active')} 
                        onChange={() => toggleStatus('active')} 
                    />
                    <CheckboxFilter 
                        label={t('history.filters.completed')} 
                        checked={selectedStatus.includes('completed')} 
                        onChange={() => toggleStatus('completed')} 
                    />
                    <CheckboxFilter 
                        label={t('history.filters.cancelled')} 
                        checked={selectedStatus.includes('cancelled')} 
                        onChange={() => toggleStatus('cancelled')} 
                    />
                </FilterSection>


            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
                
                <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {filteredOrders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
                
                {/* Empty State */}
                {filteredOrders.length === 0 && (
                    <div className="text-center py-24 bg-coffee-50 dark:bg-coffee-900 rounded-[3rem] border border-coffee-100 dark:border-coffee-800 shadow-inner">
                        <div className="w-24 h-24 bg-white dark:bg-coffee-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-coffee-100 dark:shadow-none">
                            <ShoppingBag className="w-10 h-10 text-coffee-400 fill-coffee-100 dark:fill-coffee-900/20" />
                        </div>
                        <h3 className="text-3xl font-serif font-bold text-coffee-900 dark:text-white mb-3">{t('history.empty.title')}</h3>
                        <p className="text-coffee-500 dark:text-coffee-400 mb-8 max-w-md mx-auto text-lg leading-relaxed">{t('history.empty.desc')}</p>
                        <Button size="lg" onClick={() => navigate('/menu')} className="rounded-full px-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                            {t('history.empty.browse')}
                        </Button>
                    </div>
                )}

                {filteredOrders.length > 0 && (
                    <div className="flex justify-center mt-8 md:mt-12">
                        <button className="text-xs font-bold text-coffee-400 uppercase tracking-widest hover:text-coffee-900 dark:hover:text-white transition-colors flex items-center gap-1 group">
                            Open More <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
                        </button>
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
                        <h2 className="text-xl font-serif font-bold text-coffee-900 dark:text-white">{t('history.filters.title')}</h2>
                        <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 hover:bg-coffee-50 dark:hover:bg-coffee-800 rounded-full text-coffee-600 dark:text-coffee-300">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 space-y-2">
                        <FilterSection title={t('history.filters.status')} isOpen>
                            <CheckboxFilter 
                                label={t('history.filters.active')} 
                                checked={selectedStatus.includes('active')} 
                                onChange={() => toggleStatus('active')} 
                            />
                            <CheckboxFilter 
                                label={t('history.filters.completed')} 
                                checked={selectedStatus.includes('completed')} 
                                onChange={() => toggleStatus('completed')} 
                            />
                            <CheckboxFilter 
                                label={t('history.filters.cancelled')} 
                                checked={selectedStatus.includes('cancelled')} 
                                onChange={() => toggleStatus('cancelled')} 
                            />
                        </FilterSection>
                    </div>

                    <div className="p-6 border-t border-coffee-100 dark:border-coffee-800 bg-white dark:bg-coffee-900 space-y-4">

                        <button 
                            onClick={() => setIsMobileFiltersOpen(false)}
                            className="w-full py-4 bg-coffee-900 dark:bg-coffee-100 text-white dark:text-coffee-900 rounded-full font-bold shadow-lg active:scale-95 transition-transform"
                        >
                            {t('menu.showResults')} ({filteredOrders.length})
                        </button>
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </div>
  );
};
