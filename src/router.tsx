import { AnalyticsPage } from '@/pages/Dashboard/AnalyticsPage';
import { BIPage } from '@/pages/Dashboard/BIPage';
import { UsersPage } from '@/pages/Dashboard/Users/UsersPage';
import { TransactionsPage } from '@/pages/Dashboard/Transactions/TransactionsPage';
import { OrderDetailAdmin } from '@/pages/Dashboard/Orders/OrderDetailAdmin';
import { ProductList } from '@/pages/Dashboard/Products/ProductList';
import { ProductForm } from '@/pages/Dashboard/Products/ProductForm';
import { InventoryPage } from '@/pages/Dashboard/Inventory/InventoryPage';
import { CustomerSegmentsPage } from '@/pages/Dashboard/Customers/CustomerSegmentsPage';
import { FinancePage } from '@/pages/Dashboard/Finance/FinancePage';
import { JobsManager } from '@/pages/Dashboard/CMS/JobsManager';
import { JobForm } from '@/pages/Dashboard/CMS/JobForm';
import { LocationsManager } from '@/pages/Dashboard/CMS/LocationsManager';
import { LocationForm } from '@/pages/Dashboard/CMS/LocationForm';
import { AddInventoryItem } from '@/pages/Dashboard/Inventory/AddInventoryItem';
import { RootLayout } from '@/layouts/RootLayout';
import { HomePage } from '@/pages/Home/HomePage';
import { MenuPage } from '@/pages/Menu/MenuPage';
import { ProductDetailPage } from '@/pages/Product/ProductDetailPage';
import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PageTransition } from '@/components/common/PageTransition';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/pages/Dashboard/DashboardLayout';
import { DashboardHome } from '@/pages/Dashboard/DashboardHome';
import { BaristaView } from '@/pages/Dashboard/BaristaView';
import { LogisticsPage } from '@/pages/Dashboard/LogisticsPage';
import { RewardsPage } from '@/pages/Rewards/RewardsPage';
import { WishlistPage } from '@/pages/Wishlist/WishlistPage';
import { FavoritesPage } from '@/pages/Favorites/FavoritesPage';
import { SettingsPage } from '@/pages/Settings/SettingsPage';
const CheckoutPage = lazy(() => import('@/pages/Checkout/CheckoutPage').then(module => ({ default: module.CheckoutPage })));
const ThankYouPage = lazy(() => import('@/pages/Checkout/ThankYouPage').then(module => ({ default: module.ThankYouPage })));
const OrderHistoryPage = lazy(() => import('@/pages/History/OrderHistoryPage').then(module => ({ default: module.OrderHistoryPage })));

// About Sub-pages
const OurStoryPage = lazy(() => import('@/pages/About/OurStoryPage').then(module => ({ default: module.OurStoryPage })));
const CareersPage = lazy(() => import('@/pages/About/CareersPage').then(module => ({ default: module.CareersPage })));
const LocationsPage = lazy(() => import('@/pages/About/LocationsPage').then(module => ({ default: module.LocationsPage })));

// Auth Flow Pages
const ForgotPasswordPage = lazy(() => import('@/features/auth/ForgotPasswordPage').then(module => ({ default: module.ForgotPasswordPage })));
const VerifyOtpPage = lazy(() => import('@/features/auth/VerifyOtpPage').then(module => ({ default: module.VerifyOtpPage })));
const ResetPasswordPage = lazy(() => import('@/features/auth/ResetPasswordPage').then(module => ({ default: module.ResetPasswordPage })));

// Error Pages
const UnauthorizedPage = lazy(() => import('@/pages/Error/UnauthorizedPage').then(module => ({ default: module.UnauthorizedPage })));
const NotFoundPage = lazy(() => import('@/pages/Error/NotFoundPage').then(module => ({ default: module.NotFoundPage })));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <PageTransition><HomePage /></PageTransition>,
      },
      {
        path: 'menu',
        element: <PageTransition><MenuPage /></PageTransition>,
      },
      {
        path: 'product/:id',
        element: <PageTransition><ProductDetailPage /></PageTransition>,
      },
      {
        path: 'about',
        element: <PageTransition><OurStoryPage /></PageTransition>,
      },
      {
        path: 'about/careers',
        element: <PageTransition><CareersPage /></PageTransition>,
      },
      {
        path: 'about/locations',
        element: <PageTransition><LocationsPage /></PageTransition>,
      },
      {
        path: 'rewards',
        element: <ProtectedRoute><PageTransition><RewardsPage /></PageTransition></ProtectedRoute>,
      },
      {
        path: 'favorites',
        element: <ProtectedRoute><PageTransition><FavoritesPage /></PageTransition></ProtectedRoute>,
      },
      {
        path: 'wishlist',
        element: <ProtectedRoute><PageTransition><WishlistPage /></PageTransition></ProtectedRoute>,
      },
      {
        path: 'settings',
        element: <ProtectedRoute><PageTransition><SettingsPage /></PageTransition></ProtectedRoute>,
      },
      {
        path: 'cart',
        element: <Navigate to="/checkout" replace />,
      },
      {
        path: 'checkout',
        element: <ProtectedRoute><PageTransition><CheckoutPage /></PageTransition></ProtectedRoute>,
      },
      {
        path: 'payment',
        element: <Navigate to="/checkout" replace />,
      },
      {
        path: 'thank-you',
        element: <ProtectedRoute><PageTransition><ThankYouPage /></PageTransition></ProtectedRoute>,
      },
      {
        path: 'history',
        element: <ProtectedRoute><PageTransition><OrderHistoryPage /></PageTransition></ProtectedRoute>,
      },
      {
        path: 'login',
        element: <PageTransition><LoginPage /></PageTransition>,
      },
      {
        path: 'register',
        element: <PageTransition><RegisterPage /></PageTransition>,
      },
      {
        path: 'forgot-password',
        element: <PageTransition><ForgotPasswordPage /></PageTransition>,
      },
      {
        path: 'verify-otp',
        element: <PageTransition><VerifyOtpPage /></PageTransition>,
      },
      {
        path: 'reset-password',
        element: <PageTransition><ResetPasswordPage /></PageTransition>,
      },
      {
        path: 'dashboard',
        element: <ProtectedRoute allowedRoles={['admin', 'superadmin', 'barista', 'data_analyst']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { index: true, element: <DashboardHome /> },
              { path: 'orders', element: <BaristaView /> },
              { path: 'logistics', element: <LogisticsPage /> },
              { path: 'analytics', element: <AnalyticsPage /> },
              { path: 'bi', element: <BIPage /> },
              { path: 'users', element: <UsersPage /> },
              { path: 'transactions', element: <TransactionsPage /> },
              { path: 'transactions/:id', element: <OrderDetailAdmin /> },
              { path: 'products', element: <ProductList /> },
              { path: 'products/new', element: <ProductForm /> },
              { path: 'products/:id', element: <ProductForm /> },
              { path: 'inventory', element: <InventoryPage /> },
              { path: 'inventory/new', element: <AddInventoryItem /> },
              { path: 'segments', element: <CustomerSegmentsPage /> },
              { path: 'finance', element: <FinancePage /> },
              { path: 'cms/jobs', element: <JobsManager /> },
              { path: 'cms/jobs/new', element: <JobForm /> },
              { path: 'cms/jobs/:id', element: <JobForm /> },
              { path: 'cms/locations', element: <LocationsManager /> },
              { path: 'cms/locations/new', element: <LocationForm /> },
              { path: 'cms/locations/:id', element: <LocationForm /> },
            ],
          },
        ],
      },
      {
        path: '403',
        element: <PageTransition><UnauthorizedPage /></PageTransition>,
      },
      {
        path: '404',
        element: <PageTransition><NotFoundPage /></PageTransition>,
      },
      {
        path: '*',
        element: <Navigate to="/404" replace />,
      },
    ],
  },
]);
