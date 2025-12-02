import React, { useState } from 'react';
import { AuthLayout } from './components/AuthLayout';
import { Button } from '../../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store';
import { Eye, EyeOff, Facebook, Chrome, Smartphone, AlertCircle } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '../../utils/cn';
import { useLanguage } from '../../contexts/LanguageContext';

import { SEO } from '@/components/common/SEO';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const registerAction = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();

  // Validation Schema
  const registerSchema = z.object({
    name: z.string().min(2, t('auth.register.validation.nameMin')),
    email: z.string().min(1, t('auth.register.validation.emailRequired')).email(t('auth.register.validation.emailInvalid')),
    password: z.string()
      .min(8, t('auth.register.validation.passwordMin'))
      .regex(/[A-Z]/, t('auth.register.validation.passwordUppercase'))
      .regex(/[0-9]/, t('auth.register.validation.passwordNumber')),
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('auth.register.validation.passwordMatch'),
    path: ["confirmPassword"],
  });

  type RegisterFormValues = z.infer<typeof registerSchema>;

  // Form Hooks
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerAction(data.name, data.email);
      navigate('/');
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <AuthLayout 
      title={t('auth.register.title')}
      subtitle={t('auth.register.subtitle')}
    >
      <SEO 
        title="Create Account" 
        description="Join Coffee & Co today. Create an account to start earning rewards, saving your favorites, and enjoying a personalized coffee experience."
      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Name Field */}
        <div className="space-y-2">
            <Label htmlFor="name" className={errors.name ? "text-red-500" : ""}>{t('auth.register.nameLabel')}</Label>
            <Input 
                id="name"
                type="text" 
                placeholder="John Doe"
                className={cn(errors.name && "border-red-500 focus-visible:ring-red-400")}
                {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" /> {errors.name.message}
              </p>
            )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
            <Label htmlFor="email" className={errors.email ? "text-red-500" : ""}>{t('auth.register.emailLabel')}</Label>
            <Input 
                id="email"
                type="email" 
                placeholder="you@example.com"
                className={cn(errors.email && "border-red-500 focus-visible:ring-red-400")}
                {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" /> {errors.email.message}
              </p>
            )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
            <Label htmlFor="password" className={errors.password ? "text-red-500" : ""}>{t('auth.register.passwordLabel')}</Label>
            <div className="relative">
                <Input 
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    className={cn("pr-12", errors.password && "border-red-500 focus-visible:ring-red-400")}
                    {...register("password")}
                />
                <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-400 dark:text-coffee-500 hover:text-coffee-600 dark:hover:text-coffee-300 focus:outline-none"
                    tabIndex={-1}
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" /> {errors.password.message}
              </p>
            )}
        </div>

        {/* Confirm Password Field */}
         <div className="space-y-2">
            <Label htmlFor="confirmPassword" className={errors.confirmPassword ? "text-red-500" : ""}>{t('auth.register.confirmPasswordLabel')}</Label>
            <Input 
                id="confirmPassword"
                type="password"
                placeholder="••••••••••"
                className={cn(errors.confirmPassword && "border-red-500 focus-visible:ring-red-400")}
                {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" /> {errors.confirmPassword.message}
              </p>
            )}
        </div>

        <Button 
            variant="secondary" 
            fullWidth 
            size="lg" 
            type="submit"
            disabled={isLoading}
            className="!rounded-xl h-12 mt-6 font-bold"
        >
            {isLoading ? t('auth.register.submitting') : t('auth.register.submit')}
        </Button>

        {/* Divider */}
        <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-coffee-100 dark:border-coffee-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-coffee-950 px-4 text-coffee-400 dark:text-coffee-500 tracking-wider">{t('auth.register.or')}</span>
            </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-3 gap-3">
            <button type="button" className="flex items-center justify-center h-12 bg-cream-100 dark:bg-coffee-800 hover:bg-cream-200 dark:hover:bg-coffee-700 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-coffee-400 focus:ring-offset-2">
                <Smartphone className="w-5 h-5 text-coffee-700 dark:text-coffee-200" />
            </button>
            <button type="button" className="flex items-center justify-center h-12 bg-cream-100 dark:bg-coffee-800 hover:bg-cream-200 dark:hover:bg-coffee-700 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-coffee-400 focus:ring-offset-2">
                <Chrome className="w-5 h-5 text-red-500 dark:text-red-400" />
            </button>
            <button type="button" className="flex items-center justify-center h-12 bg-cream-100 dark:bg-coffee-800 hover:bg-cream-200 dark:hover:bg-coffee-700 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-coffee-400 focus:ring-offset-2">
                <Facebook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </button>
        </div>

        <p className="text-center text-sm text-coffee-500 dark:text-coffee-400 pt-4">
            {t('auth.register.hasAccount')}{' '}
            <Link to="/login" className="font-bold text-coffee-900 dark:text-white hover:underline">
                {t('auth.register.login')}
            </Link>
        </p>
      </form>
    </AuthLayout>
  );
};