
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, deleteProduct } from '../../../services/api';
import { Button } from '../../../components/common/Button';
import { Plus, Edit, Trash2, Search, Package, Download } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { CURRENCY } from '../../../utils/constants';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { exportData } from '../../../utils/export';
import { useLanguage } from '../../../contexts/LanguageContext';

import { motion } from 'framer-motion';

export const ProductList: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(t('dashboard.products.toast.deleted'));
    },
    onError: () => {
      toast.error(t('dashboard.products.toast.deleteFailed'));
    }
  });

  const filteredProducts = React.useMemo(() => {
    if (!products) return [];
    return products.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const handleExport = (format: string) => {
    if (filteredProducts.length === 0) {
        toast.error(t('dashboard.products.toast.noExport'));
        return;
    }
    
    // Clean data for export (remove UI-specific fields if any, though Product type is clean)
    const exportPayload = filteredProducts.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        rating: p.rating,
        stock_status: 'In Stock', // mock status
        last_updated: new Date().toISOString()
    }));

    exportData(exportPayload, 'product_inventory', format as 'csv' | 'json');
    toast.success(t('dashboard.products.toast.exported', { format: format.toUpperCase() }));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        staggerChildren: 0.05 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  if (isLoading) return <div className="p-8 text-center text-coffee-500">{t('dashboard.products.loading')}</div>;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
           <h1 className="text-3xl font-bold text-coffee-900 dark:text-white">{t('dashboard.products.title')}</h1>
           <p className="text-coffee-500 dark:text-coffee-400">{t('dashboard.products.subtitle')}</p>
        </div>
        <div className="flex gap-3">
            {/* Export Selector */}
            <Select onValueChange={handleExport}>
                <SelectTrigger className="w-[140px] bg-white dark:bg-coffee-900 h-11 rounded-full border border-coffee-200 dark:border-coffee-700">
                    <div className="flex items-center gap-2 text-coffee-700 dark:text-coffee-300 font-medium">
                        <Download className="w-4 h-4" />
                        <span className="text-sm">{t('dashboard.products.export')}</span>
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="csv">Excel (CSV)</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
            </Select>

            <Button onClick={() => navigate('/dashboard/products/new')} className="gap-2">
                <Plus className="w-4 h-4" /> {t('dashboard.products.addProduct')}
            </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-coffee-900 rounded-2xl border border-coffee-100 dark:border-coffee-800 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-coffee-100 dark:border-coffee-800 flex gap-4">
           <div className="relative flex-1 max-w-sm">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-400 dark:text-coffee-500" />
             <Input 
                placeholder={t('dashboard.products.searchPlaceholder')}
                className="pl-10 h-10 bg-coffee-50/50 dark:bg-coffee-800/50 border-coffee-200 dark:border-coffee-700"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
             />
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-coffee-50 dark:bg-coffee-800 text-coffee-900 dark:text-white font-bold text-sm border-b border-coffee-100 dark:border-coffee-800">
               <tr>
                 <th className="px-6 py-4">{t('dashboard.products.table.product')}</th>
                 <th className="px-6 py-4">{t('dashboard.products.table.category')}</th>
                 <th className="px-6 py-4">{t('dashboard.products.table.price')}</th>
                 <th className="px-6 py-4">{t('dashboard.products.table.status')}</th>
                 <th className="px-6 py-4 text-right">{t('dashboard.products.table.actions')}</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-coffee-50 dark:divide-coffee-800">
               {filteredProducts.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-coffee-500">
                        <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        {t('dashboard.products.noProducts')}
                    </td>
                 </tr>
               ) : (
                 filteredProducts.map((product) => (
                   <motion.tr 
                     key={product.id} 
                     variants={itemVariants}
                     className="hover:bg-coffee-50/30 dark:hover:bg-coffee-800/30 transition-colors"
                   >
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-lg bg-coffee-100 dark:bg-coffee-800 overflow-hidden shrink-0">
                             <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                           </div>
                           <div>
                              <p className="font-bold text-coffee-900 dark:text-white">{product.name}</p>
                              <p className="text-xs text-coffee-500 dark:text-coffee-400">ID: {product.id}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-cream-100 dark:bg-coffee-800 text-coffee-600 dark:text-coffee-300 text-xs font-bold capitalize">
                            {product.category}
                        </span>
                     </td>
                     <td className="px-6 py-4 font-medium text-coffee-900 dark:text-white">
                        {CURRENCY}{product.price.toFixed(2)}
                     </td>
                     <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            {t('common.userStatus.active')}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <Link 
                             to={`/dashboard/products/${product.id}`}
                             className="p-2 text-coffee-500 dark:text-coffee-400 hover:text-coffee-900 dark:hover:text-white hover:bg-coffee-100 dark:hover:bg-coffee-800 rounded-lg transition-colors"
                           >
                              <Edit className="w-4 h-4" />
                           </Link>
                           
                           <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button className="p-2 text-coffee-500 dark:text-coffee-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{t('dashboard.products.deleteDialog.title')}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {t('dashboard.products.deleteDialog.desc', { name: product.name })}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>{t('dashboard.products.deleteDialog.cancel')}</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteMutation.mutate(product.id)}>
                                        {t('dashboard.products.deleteDialog.delete')}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                           </AlertDialog>
                        </div>
                     </td>
                   </motion.tr>
                 ))
               )}
             </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
