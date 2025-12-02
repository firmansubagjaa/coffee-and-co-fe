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
      {!isDashboard && <Footer />}
    </div>
  );
};
