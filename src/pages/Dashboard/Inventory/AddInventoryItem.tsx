import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';

const inventorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  sku: z.string().min(2, "SKU is required"),
  category: z.enum(['Ingredient', 'Retail', 'Packaging', 'Equipment']),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  unit: z.string().min(1, "Unit is required"),
  parLevel: z.coerce.number().min(0, "Par level cannot be negative"),
  unitCost: z.coerce.number().min(0, "Unit cost cannot be negative"),
  supplier: z.string().min(2, "Supplier is required"),
});

type InventoryFormValues = z.infer<typeof inventorySchema>;

export const AddInventoryItem: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const { 
    register, 
    handleSubmit, 
    control,
    formState: { errors, isSubmitting } 
  } = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: '',
      sku: '',
      category: 'Ingredient',
      stock: 0,
      unit: '',
      parLevel: 0,
      unitCost: 0,
      supplier: ''
    }
  });

  const onSubmit = async (data: InventoryFormValues) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('New Inventory Item:', data);
    toast.success(t('dashboard.inventory.toast.addedSuccess'));
    navigate('/dashboard/inventory');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4 
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-3xl mx-auto pb-20"
    >
      <div className="flex items-center justify-between mb-8">
         <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/inventory')} className="px-2">
                <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
                <h1 className="text-3xl font-bold text-coffee-900 dark:text-white">{t('dashboard.inventory.form.title')}</h1>
                <p className="text-coffee-500 dark:text-coffee-300">{t('dashboard.inventory.form.subtitle')}</p>
            </div>
         </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white dark:bg-coffee-900 p-6 rounded-2xl border border-coffee-100 dark:border-coffee-800 shadow-sm space-y-6">
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name" className="dark:text-coffee-100">{t('dashboard.inventory.form.labels.name')}</Label>
                    <Input id="name" {...register('name')} placeholder={t('dashboard.inventory.form.placeholders.name')} className="bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-white" />
                    {errors.name && <p className="text-xs text-red-500">{t('dashboard.inventory.form.validation.nameRequired')}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="sku" className="dark:text-coffee-100">{t('dashboard.inventory.form.labels.sku')}</Label>
                    <Input id="sku" {...register('sku')} placeholder={t('dashboard.inventory.form.placeholders.sku')} className="bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-white" />
                    {errors.sku && <p className="text-xs text-red-500">{t('dashboard.inventory.form.validation.skuRequired')}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="dark:text-coffee-100">{t('dashboard.inventory.form.labels.category')}</Label>
                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-white">
                                    <SelectValue placeholder={t('dashboard.inventory.form.placeholders.category')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Ingredient">{t('dashboard.inventory.form.options.ingredient')}</SelectItem>
                                    <SelectItem value="Retail">{t('dashboard.inventory.form.options.retail')}</SelectItem>
                                    <SelectItem value="Packaging">{t('dashboard.inventory.form.options.packaging')}</SelectItem>
                                    <SelectItem value="Equipment">{t('dashboard.inventory.form.options.equipment')}</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="supplier" className="dark:text-coffee-100">{t('dashboard.inventory.form.labels.supplier')}</Label>
                    <Input id="supplier" {...register('supplier')} placeholder={t('dashboard.inventory.form.placeholders.supplier')} className="bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-white" />
                    {errors.supplier && <p className="text-xs text-red-500">{t('dashboard.inventory.form.validation.supplierRequired')}</p>}
                </div>
            </div>

            {/* Stock Details */}
            <div className="border-t border-coffee-100 dark:border-coffee-800 pt-6">
                <h3 className="font-bold text-coffee-900 dark:text-white mb-4">{t('dashboard.inventory.form.stockDetails')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="stock" className="dark:text-coffee-100">{t('dashboard.inventory.form.labels.currentStock')}</Label>
                        <Input id="stock" type="number" {...register('stock')} className="bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-white" />
                        {errors.stock && <p className="text-xs text-red-500">{t('dashboard.inventory.form.validation.stockNegative')}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="unit" className="dark:text-coffee-100">{t('dashboard.inventory.form.labels.unit')}</Label>
                        <Input id="unit" {...register('unit')} placeholder={t('dashboard.inventory.form.placeholders.unit')} className="bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-white" />
                        {errors.unit && <p className="text-xs text-red-500">{t('dashboard.inventory.form.validation.unitRequired')}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="parLevel" className="dark:text-coffee-100">{t('dashboard.inventory.form.labels.parLevel')}</Label>
                        <Input id="parLevel" type="number" {...register('parLevel')} className="bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-white" />
                        <p className="text-[10px] text-coffee-400">{t('dashboard.inventory.form.helper.parLevel')}</p>
                        {errors.parLevel && <p className="text-xs text-red-500">{t('dashboard.inventory.form.validation.parLevelNegative')}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="unitCost" className="dark:text-coffee-100">{t('dashboard.inventory.form.labels.unitCost')}</Label>
                        <Input id="unitCost" type="number" step="0.01" {...register('unitCost')} className="bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-white" />
                        {errors.unitCost && <p className="text-xs text-red-500">{t('dashboard.inventory.form.validation.unitCostNegative')}</p>}
                    </div>
                </div>
            </div>

        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-coffee-100 dark:border-coffee-800 mt-8">
            <Button type="button" variant="ghost" onClick={() => navigate('/dashboard/inventory')}>{t('dashboard.inventory.form.buttons.cancel')}</Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2 shadow-lg bg-coffee-600 hover:bg-coffee-700 text-white">
                {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                {t('dashboard.inventory.form.buttons.save')}
            </Button>
        </div>
      </form>
    </motion.div>
  );
};
