import React, { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { CartDrawer } from "@/components/common/CartDrawer";
import { MobileBottomNav } from "@/components/common/MobileBottomNav";

import { LoadingScreen } from "@/components/common/LoadingScreen";

import { SEO } from "@/components/common/SEO";
import { NetworkStatusIndicator } from "@/components/common/NetworkStatus";
import { SkipLink } from "@/components/common/Accessibility";
import { useScrollToTop } from "@/utils/scroll";
import NProgress from "nprogress";

export const RootLayout: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isLogin = location.pathname.startsWith("/login");
  const isRegister = location.pathname.startsWith("/register");
  const isAuth = isLogin || isRegister;
  const isResetPassword = location.pathname.startsWith("/reset-password");
  const isVerifyOtp = location.pathname.startsWith("/verify-otp");
  const isForgotPassword = location.pathname.startsWith("/forgot-password");
  
  // Determine if we should show the mobile bottom nav (hide only on dashboard)
  const showMobileNav = !isDashboard;

  // Scroll to top on route change
  useScrollToTop();

  // Complete progress bar on route change
  useEffect(() => {
    NProgress.done();
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-cream-50 dark:bg-coffee-950 text-coffee-900 dark:text-coffee-100 font-sans selection:bg-coffee-200 selection:text-coffee-900">
      <SkipLink />
      <NetworkStatusIndicator />
      <SEO />
      <Header />
      {/* Add bottom padding on mobile to prevent content from being hidden behind bottom nav */}
      <main id="main-content" className={`flex-1 ${showMobileNav ? 'pb-20 md:pb-0' : ''}`} role="main">
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </main>
      <CartDrawer />
      {showMobileNav && <MobileBottomNav />}
      {showMobileNav && <Footer />}
    </div>
  );
};
