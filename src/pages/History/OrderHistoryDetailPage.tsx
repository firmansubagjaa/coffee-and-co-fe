import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  Package, 
  Truck, 
  Receipt,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText
} from 'lucide-react';
import { useOrderStore } from '../../features/orders/store';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/ui/badge';
import { CURRENCY } from '../../utils/constants';
import { SEO } from '@/components/common/SEO';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "../../components/ui/Breadcrumb";
import { toast } from 'sonner';

export const OrderHistoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders } = useOrderStore();
  const { t } = useLanguage();

  // Normalize ID comparison to handle potential hash prefixes in stored data
  const order = orders.find(o => o.id.replace('#', '') === id);

  if (!order) {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-coffee-950 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-coffee-900 dark:text-white">Order Not Found</h2>
          <Button onClick={() => navigate('/history')} variant="outline">
            Return to History
          </Button>
        </div>
      </div>
    );
  }

  const isDelivered = order.status === 'Delivered';

  const handleDownloadInvoice = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
        loading: 'Generating invoice...',
        success: 'Invoice downloaded successfully!',
        error: 'Failed to download invoice',
    });
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-coffee-950 pt-6 pb-20">
      <SEO 
        title={`Order #${order.id}`} 
        description={`Order details for #${order.id}`}
      />
      
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        {/* Breadcrumbs */}
        <div className="mb-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink to="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink to="/history">History</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Order Details</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>

        {/* Header Navigation */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => navigate('/history')}
                    className="rounded-full hover:bg-coffee-100 dark:hover:bg-coffee-800 text-coffee-900 dark:text-white shrink-0"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-coffee-900 dark:text-white">
                        Order #{order.id.replace('#', '')}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-coffee-500 dark:text-white/60">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(order.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(order.date).toLocaleTimeString()}</span>
                    </div>
                </div>
            </div>
            
            <Button 
                onClick={handleDownloadInvoice}
                variant="outline" 
                className="flex items-center gap-2 rounded-xl border-coffee-200 dark:border-white/10 hover:bg-coffee-50 dark:hover:bg-white/5 text-coffee-900 dark:text-white hover:text-coffee-900 dark:hover:text-white"
            >
                <Download className="w-4 h-4" />
                Download Invoice
            </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (Main Content) */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-2 space-y-6"
            >
                {/* Order Items Card */}
                <div className="bg-white dark:bg-[#3C2A21] rounded-[2rem] p-6 md:p-8 shadow-sm border border-coffee-100 dark:border-none">
                    <h3 className="text-xl font-bold text-coffee-900 dark:text-white mb-6 flex items-center gap-2">
                        <Receipt className="h-5 w-5" />
                        Order Items
                    </h3>
                    
                    <div className="space-y-6">
                        {order.items.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="flex gap-4 md:gap-6 items-center group">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-coffee-50 dark:bg-black/20 shrink-0 border border-coffee-100 dark:border-white/5 group-hover:scale-105 transition-transform duration-300">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-serif font-bold text-lg text-coffee-900 dark:text-white truncate">{item.name}</h4>
                                    <p className="text-sm text-coffee-500 dark:text-white/60 mb-2">{item.category}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(item.selectedVariant || item.selectedSize) ? (
                                            <>
                                                {item.selectedVariant && <Badge variant="secondary" className="rounded-lg bg-coffee-50 dark:bg-white/10 text-coffee-700 dark:text-white/80">{item.selectedVariant.name}</Badge>}
                                                {item.selectedSize && <Badge variant="secondary" className="rounded-lg bg-coffee-50 dark:bg-white/10 text-coffee-700 dark:text-white/80">{item.selectedSize}</Badge>}
                                            </>
                                        ) : (
                                            <Badge variant="secondary" className="rounded-lg bg-coffee-50 dark:bg-white/10 text-coffee-700 dark:text-white/80">Standard</Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-coffee-500 dark:text-white/60 mb-1">x{item.quantity}</p>
                                    <p className="font-bold text-lg text-coffee-900 dark:text-white">{CURRENCY}{item.price.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-dashed border-coffee-200 dark:border-white/10">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-coffee-900 dark:text-white text-lg">Total Amount</span>
                            <span className="font-serif font-bold text-3xl text-coffee-900 dark:text-white">{CURRENCY}{order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Right Column (Sidebar Info) */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
            >
                {/* Status Card */}
                <div className="bg-white dark:bg-[#3C2A21] rounded-[2rem] p-6 md:p-8 shadow-sm border border-coffee-100 dark:border-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <Package className="w-24 h-24 rotate-12" />
                    </div>
                    
                    <div className="relative z-10">
                        <h3 className="text-sm font-bold text-coffee-400 dark:text-white/40 uppercase tracking-widest mb-4">Order Status</h3>
                        <div className="flex items-center gap-3 mb-6">
                            <Badge className={`rounded-full px-4 py-1.5 font-bold text-sm uppercase tracking-wider ${isDelivered ? 'bg-coffee-900 text-white dark:bg-white dark:text-coffee-900' : 'bg-yellow-100 text-yellow-900'}`}>
                                {order.status}
                            </Badge>
                        </div>

                        {/* Vertical Timeline */}
                        <div className="space-y-6 relative pl-4 border-l-2 border-coffee-100 dark:border-white/10 ml-2">
                             {['Ordered', 'Preparing', 'Delivered'].map((step, index) => {
                                const isCompleted = isDelivered || (order.status === 'In process' && index <= 1);
                                const isCurrent = !isDelivered && order.status === 'In process' && index === 1;
                                
                                return (
                                    <div key={step} className="relative pl-6">
                                        <div className={`absolute -left-[21px] top-0 w-4 h-4 rounded-full border-2 transition-colors ${isCompleted ? 'bg-coffee-900 border-coffee-900 dark:bg-white dark:border-white' : 'bg-white border-coffee-200 dark:bg-coffee-900 dark:border-white/20'}`} />
                                        <p className={`text-sm font-bold ${isCompleted ? 'text-coffee-900 dark:text-white' : 'text-coffee-300 dark:text-white/30'}`}>{step}</p>
                                        {isCurrent && <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 font-medium">In Progress...</p>}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Details Card */}
                <div className="bg-coffee-50 dark:bg-black/20 rounded-[2rem] p-6 md:p-8 space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-coffee-400 dark:text-white/40">
                            <FileText className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Order Info</span>
                        </div>
                        <p className="font-medium text-coffee-900 dark:text-white">ID: #{order.id.replace('#', '')}</p>
                        <p className="text-sm text-coffee-500 dark:text-white/60">Payment: Credit Card ending in 4242</p>
                    </div>

                    <div className="border-t border-coffee-200 dark:border-white/10 pt-6">
                        <div className="flex items-center gap-2 mb-2 text-coffee-400 dark:text-white/40">
                            <MapPin className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Delivery Location</span>
                        </div>
                        <p className="font-medium text-coffee-900 dark:text-white leading-relaxed">{order.location}</p>
                    </div>
                </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
};
