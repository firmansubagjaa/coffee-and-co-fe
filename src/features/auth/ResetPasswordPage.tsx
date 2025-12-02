
import React, { useState } from 'react';
import { AuthLayout } from './components/AuthLayout';
import { Button } from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from './store';
import { Eye, EyeOff, Lock, AlertCircle } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { cn } from '../../utils/cn';
import { useLanguage } from '../../contexts/LanguageContext';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { resetPassword, isLoading, resetEmail } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();

  const resetSchema = z.object({
    password: z.string()
      .min(8, t('auth.register.validation.passwordMin'))
      .regex(/[A-Z]/, t('auth.register.validation.passwordUppercase'))
      .regex(/[0-9]/, t('auth.register.validation.passwordNumber')),
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('auth.register.validation.passwordMatch'),
    path: ["confirmPassword"],
  });

  type FormValues = z.infer<typeof resetSchema>;

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(resetSchema)
  });

  // Protect route
  if (!resetEmail) {
    navigate('/forgot-password');
    return null;
  }

  const onSubmit = async (data: FormValues) => {
    await resetPassword(data.password);
    toast.success(t('auth.resetPassword.success.title'), {
        description: t('auth.resetPassword.success.desc')
    });
    navigate('/login');
  };

  return (
    <AuthLayout 
      title={t('auth.resetPassword.title')}
      subtitle={t('auth.resetPassword.subtitle')}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="space-y-2">
            <Label htmlFor="password">{t('auth.resetPassword.passwordLabel')}</Label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-400" />
                <Input 
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    className={cn("pl-10 pr-12", errors.password && "border-red-500 focus-visible:ring-red-400")}
                    {...register("password")}
                    autoFocus
                />
                <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-400 hover:text-coffee-600 focus:outline-none"
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

        <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('auth.resetPassword.confirmPasswordLabel')}</Label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-400" />
                <Input 
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••••"
                    className={cn("pl-10", errors.confirmPassword && "border-red-500 focus-visible:ring-red-400")}
                    {...register("confirmPassword")}
                />
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" /> {errors.confirmPassword.message}
              </p>
            )}
        </div>

        <Button 
            variant="primary" 
            fullWidth 
            size="lg" 
            type="submit"
            disabled={isLoading}
            className="!rounded-xl h-12 mt-4 font-bold"
        >
            {isLoading ? t('auth.resetPassword.submitting') : t('auth.resetPassword.submit')}
        </Button>
      </form>
    </AuthLayout>
  );
};
