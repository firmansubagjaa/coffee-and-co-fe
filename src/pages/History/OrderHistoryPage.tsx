
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
    const navigate = useNavigate();

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative pl-0 md:pl-8 pb-12 last:pb-0"
        >
            {/* Desktop Timeline Stem */}
            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-px bg-coffee-200 dark:bg-coffee-800">
                <div className={`absolute top-8 -left-1.5 w-3 h-3 rounded-full border-2 border-coffee-100 dark:border-coffee-900 ${isDelivered ? 'bg-coffee-900 dark:bg-white' : 'bg-yellow-500'}`} />
            </div>

            <div 
                onClick={() => navigate(`/orders/${order.id}`)}
                className="bg-[#3C2A21] dark:bg-[#1E1B1A] rounded-[2.5rem] p-6 md:p-8 text-white relative overflow-hidden group cursor-pointer transition-transform hover:-translate-y-1 duration-300"
            >
                {/* Mobile: Top Row */}
                <div className="flex justify-between items-start mb-6 md:mb-0 md:absolute md:right-8 md:top-8 md:text-right z-10">
                    <div className="md:hidden">
                        <h3 className="font-serif font-bold text-2xl tracking-tight mb-1">#{order.id}</h3>
                        <p className="text-xs text-white/60 font-medium">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="secondary" className={`rounded-full px-4 py-1.5 font-bold text-xs ${isDelivered ? 'bg-coffee-100 text-coffee-900' : 'bg-yellow-100 text-yellow-900'}`}>
                        {order.status}
                    </Badge>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
                    
                    {/* Image Section */}
                    <div className="relative w-32 h-40 md:w-48 md:h-48 shrink-0 rounded-2xl overflow-hidden bg-black/20 shadow-inner mx-auto md:mx-0">
                        <img 
                            src={order.items[0].image} 
                            alt={order.items[0].name} 
                            className="w-full h-full object-cover mix-blend-overlay opacity-90 group-hover:scale-110 transition-transform duration-700" 
                        />
                        {order.items.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full">
                                +{order.items.length - 1} more
                            </div>
                        )}
                    </div>

                    {/* Desktop: Info Section */}
                    <div className="flex-1 text-center md:text-left space-y-4 md:space-y-2">
                        <div className="hidden md:block">
                            <h3 className="font-serif font-bold text-3xl tracking-tight mb-1">#{order.id}</h3>
                            <p className="text-sm text-white/60 font-medium mb-4">{new Date(order.date).toLocaleDateString()}</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center justify-center md:justify-start gap-2 text-white/60 text-xs uppercase tracking-widest font-bold">
                                <MapPin className="w-3 h-3" />
                                <span>Location</span>
                            </div>
                            <p className="text-sm font-medium text-white/90">{order.location}</p>
                        </div>
                    </div>

                    {/* Total Section */}
                    <div className="mt-4 md:mt-0 pt-4 md:pt-0 border-t border-white/10 md:border-0 text-center md:text-right">
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Total Amount</p>
                        <p className="font-serif font-bold text-3xl text-white">{CURRENCY}{order.total.toFixed(2)}</p>
                    </div>

                    {/* Arrow Icon (Desktop) */}
                    <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-white/10 text-white/40 group-hover:bg-white group-hover:text-coffee-900 transition-all duration-300">
                        <ChevronRight className="w-5 h-5" />
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
