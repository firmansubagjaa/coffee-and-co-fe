
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { useCartStore } from '../../features/cart/store';
import { Button } from '../../components/common/Button';
import { CURRENCY } from '../../utils/constants';
import { Trash2, Plus, Minus, X, AlertCircle } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/Breadcrumb";
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/Tooltip';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '../../utils/cn';
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
} from "../../components/ui/alert-dialog";
import { CheckoutDetails } from '@/types';
import { useLanguage } from '../../contexts/LanguageContext';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, total, setCheckoutDetails } = useCartStore();
  const { t } = useLanguage();

  // Validation Schema
  const checkoutSchema = z.object({
    fullName: z.string().min(2, t('checkout.validation.nameShort')),
    mobile: z.string().min(10, t('checkout.validation.mobileInvalid')),
    email: z.string().email(t('checkout.validation.emailInvalid')),
    address: z.string().min(5, t('checkout.validation.addressShort')),
    deliveryNote: z.string().optional(),
  });

  const subtotal = total();
  const shipping = subtotal > 30 ? 0 : 5;
  const grandTotal = subtotal + shipping;

  const { 
    register, 
    handleSubmit, 
    control,
    formState: { errors } 
  } = useForm<CheckoutDetails>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: 'Anna Kitchg',
      mobile: '+49 301234567',
      email: 'annakitch@gmail.com',
      address: 'Berlin, Lindenstrabe 27, 39112',
      deliveryNote: '',
    }
  });

  const onSubmit = (data: CheckoutDetails) => {
    // Save details to store so PaymentPage can access them
    setCheckoutDetails(data);
    // Proceed to payment
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-coffee-950 pt-6">
      <SEO 
        title="Your Cart" 
        description="Review your selected items and proceed to checkout. Your perfect coffee order is just a few clicks away."
      />
      {/* Hero Section */}
      
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Breadcrumbs */}
        <div className="mb-6 md:mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink to="/">{t('nav.home')}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t('nav.cart')}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <h1 className="text-3xl md:text-5xl font-serif font-bold mb-8 md:mb-10 text-coffee-900 dark:text-white">{t('checkout.title')}</h1>

        <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12">
            
            {/* Left Column: Details (Form) - Reordered on Mobile */}
            <div className="w-full lg:w-3/5">
                <div className="bg-cream-50 dark:bg-coffee-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-coffee-100 dark:border-coffee-800 shadow-sm">
                    {/* Contact Info */}
                    <div className="flex justify-between items-center mb-6">
                         <h3 className="font-serif font-bold text-xl text-coffee-900 dark:text-white">{t('checkout.contactInfo')}</h3>
                         <button className="text-sm font-medium text-coffee-600 dark:text-coffee-300 hover:text-coffee-900 dark:hover:text-white transition-colors">{t('common.edit')}</button>
                    </div>
                    
                    <form id="checkout-form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 gap-6 mb-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className={errors.fullName ? "text-red-500" : "dark:text-coffee-100"}>{t('checkout.fullName')}</Label>
                                <Input 
                                    id="fullName"
                                    type="text" 
                                    readOnly
                                    className={cn(
                                        "h-12 bg-gray-100 dark:bg-coffee-800/50 cursor-not-allowed opacity-80", 
                                        errors.fullName && "border-red-500 focus-visible:ring-red-400"
                                    )}
                                    {...register("fullName")}
                                />
                                {errors.fullName && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">{errors.fullName.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            <div className="space-y-2">
                                <Label htmlFor="mobile" className={errors.mobile ? "text-red-500" : "dark:text-coffee-100"}>{t('settings.mobile')}</Label>
                                <Input 
                                    id="mobile"
                                    type="text" 
                                    className={cn("h-12", errors.mobile && "border-red-500 focus-visible:ring-red-400")}
                                    {...register("mobile")}
                                />
                                {errors.mobile && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">{errors.mobile.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className={errors.email ? "text-red-500" : "dark:text-coffee-100"}>{t('settings.email')}</Label>
                                <Input 
                                    id="email"
                                    type="email" 
                                    className={cn("h-12", errors.email && "border-red-500 focus-visible:ring-red-400")}
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-coffee-200 dark:border-coffee-700 my-8"></div>

                        {/* Delivery Details */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="address" className={errors.address ? "text-red-500" : "dark:text-coffee-100"}>{t('checkout.address')}</Label>
                                <Input 
                                    id="address"
                                    type="text" 
                                    className={cn("h-12", errors.address && "border-red-500 focus-visible:ring-red-400")}
                                    {...register("address")}
                                />
                                {errors.address && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">{errors.address.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deliveryNote" className={errors.deliveryNote ? "text-red-500" : "dark:text-coffee-100"}>{t('checkout.deliveryNote')}</Label>
                                <Input 
                                    id="deliveryNote"
                                    type="text" 
                                    placeholder={t('cart.notePlaceholder')}
                                    className={cn("h-12", errors.deliveryNote && "border-red-500 focus-visible:ring-red-400")}
                                    {...register("deliveryNote")}
                                />
                                {errors.deliveryNote && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">{errors.deliveryNote.message}</p>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Column: Items - Appears first on Mobile */}
            <div className="w-full lg:w-2/5">
                <div className="bg-coffee-900 dark:bg-coffee-800 text-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 h-full flex flex-col shadow-xl">
                    <h3 className="font-serif font-bold text-2xl mb-6 md:mb-8">{t('cart.summary')}</h3>
                    
                    {/* Cart Items List */}
                    <div className="flex-1 space-y-6 mb-8 overflow-y-auto pr-2 custom-scrollbar max-h-[300px] md:max-h-[400px]">
                        {items.length === 0 ? (
                            <div className="text-center py-10 text-coffee-300">
                                <p className="mb-4">{t('cart.empty')}</p>
                                <Button variant="outline" onClick={() => navigate('/menu')} className="!border-white !text-white hover:!bg-white hover:!text-coffee-900 dark:hover:!bg-coffee-700 dark:hover:!text-white">{t('cart.browseMenu')}</Button>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="flex gap-4 pb-6 border-b border-white/10 last:border-0 last:pb-0">
                                    <div className="w-16 h-16 bg-white/10 rounded-2xl shrink-0 overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-90" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-0.5">
                                        <div className="flex justify-between items-start gap-2">
                                            <div>
                                                <h4 className="font-bold text-white text-base leading-tight mb-1 line-clamp-1">{item.name}</h4>
                                                <p className="text-xs text-coffee-300 capitalize">{item.category}</p>
                                            </div>
                                            <span className="font-bold text-white">{CURRENCY}{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center bg-white/10 rounded-full px-1 h-8">
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-full flex items-center justify-center text-coffee-300 hover:text-white transition-colors"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-full flex items-center justify-center text-coffee-300 hover:text-white transition-colors"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                            
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <button 
                                                        className="text-coffee-400 hover:text-red-400 transition-colors p-2"
                                                        aria-label={t('common.remove')}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>{t('cart.removeTitle')}</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            {t('cart.removeDesc')}
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => removeFromCart(item.id)}>{t('common.remove')}</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Totals */}
                    <div className="border-t border-white/20 pt-6 mt-auto">
                        <div className="flex justify-between items-center mb-2 text-coffee-300 text-sm">
                            <span>{t('cart.subtotal')}</span>
                            <span>{CURRENCY}{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6 text-coffee-300 text-sm">
                            <span>{t('cart.shipping')}</span>
                            <span>{shipping === 0 ? t('cart.free') : `${CURRENCY}${shipping.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between items-center mb-8 text-xl font-bold">
                            <span>{t('cart.total')}</span>
                            <span>{CURRENCY}{grandTotal.toFixed(2)}</span>
                        </div>
                        
                        <Button 
                            fullWidth 
                            size="lg" 
                            disabled={items.length === 0}
                            variant="secondary"
                            type="submit"
                            form="checkout-form"
                            className="shadow-lg font-bold text-coffee-900 h-14"
                        >
                            {t('cart.selectPayment')}
                        </Button>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
