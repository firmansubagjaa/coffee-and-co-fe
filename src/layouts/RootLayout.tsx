import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { CartDrawer } from '@/components/common/CartDrawer';

import { LoadingScreen } from '@/components/common/LoadingScreen';

import { SEO } from '@/components/common/SEO';

export const RootLayout: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isLogin = location.pathname.startsWith('/login');
  const isRegister = location.pathname.startsWith('/register');
  const isAuth = isLogin || isRegister; 
  const isResetPassword = location.pathname.startsWith('/reset-password');
  const isVerifyOtp = location.pathname.startsWith('/verify-otp');
  const isForgotPassword = location.pathname.startsWith('/forgot-password');

  return (
    <div className="flex flex-col min-h-screen bg-cream-50 dark:bg-coffee-950 text-coffee-900 dark:text-coffee-100 font-sans selection:bg-coffee-200 selection:text-coffee-900">
      <SEO />
      <Header />
      <div className="flex-1">
        <Suspense fallback={<LoadingScreen />}>
            <Outlet />
        </Suspense>
      </div>
      <CartDrawer />
      {!isDashboard && !isAuth && !isResetPassword && !isVerifyOtp && !isForgotPassword && <Footer />}
    </div>
  );
};
