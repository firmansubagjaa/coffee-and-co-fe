import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "@/layouts/RootLayout";
import { PageTransition } from "@/components/common/PageTransition";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LoadingScreen } from "@/components/common/LoadingScreen";

// Critical path - keep synchronous for fast initial load
import { HomePage } from "@/pages/Home/HomePage";

// Lazy load all other pages
const MenuPage = lazy(() =>
  import("@/pages/Menu/MenuPage").then((module) => ({
    default: module.MenuPage,
  }))
);
const ProductDetailPage = lazy(() =>
  import("@/pages/Product/ProductDetailPage").then((module) => ({
    default: module.ProductDetailPage,
  }))
);
const LoginPage = lazy(() =>
  import("@/features/auth/LoginPage").then((module) => ({
    default: module.LoginPage,
  }))
);
const RegisterPage = lazy(() =>
  import("@/features/auth/RegisterPage").then((module) => ({
    default: module.RegisterPage,
  }))
);

// Dashboard components - lazy loaded
const DashboardLayout = lazy(() =>
  import("@/pages/Dashboard/DashboardLayout").then((module) => ({
    default: module.DashboardLayout,
  }))
);
const DashboardHome = lazy(() =>
  import("@/pages/Dashboard/DashboardHome").then((module) => ({
    default: module.DashboardHome,
  }))
);
const BaristaView = lazy(() =>
  import("@/pages/Dashboard/BaristaView").then((module) => ({
    default: module.BaristaView,
  }))
);
const LogisticsPage = lazy(() =>
  import("@/pages/Dashboard/LogisticsPage").then((module) => ({
    default: module.LogisticsPage,
  }))
);
const AnalyticsPage = lazy(() =>
  import("@/pages/Dashboard/AnalyticsPage").then((module) => ({
    default: module.AnalyticsPage,
  }))
);
const BIPage = lazy(() =>
  import("@/pages/Dashboard/BIPage").then((module) => ({
    default: module.BIPage,
  }))
);
const UsersPage = lazy(() =>
  import("@/pages/Dashboard/Users/UsersPage").then((module) => ({
    default: module.UsersPage,
  }))
);
const TransactionsPage = lazy(() =>
  import("@/pages/Dashboard/Transactions/TransactionsPage").then((module) => ({
    default: module.TransactionsPage,
  }))
);
const OrderDetailAdmin = lazy(() =>
  import("@/pages/Dashboard/Orders/OrderDetailAdmin").then((module) => ({
    default: module.OrderDetailAdmin,
  }))
);
const ProductList = lazy(() =>
  import("@/pages/Dashboard/Products/ProductList").then((module) => ({
    default: module.ProductList,
  }))
);
const ProductForm = lazy(() =>
  import("@/pages/Dashboard/Products/ProductForm").then((module) => ({
    default: module.ProductForm,
  }))
);
const InventoryPage = lazy(() =>
  import("@/pages/Dashboard/Inventory/InventoryPage").then((module) => ({
    default: module.InventoryPage,
  }))
);
const AddInventoryItem = lazy(() =>
  import("@/pages/Dashboard/Inventory/AddInventoryItem").then((module) => ({
    default: module.AddInventoryItem,
  }))
);
const CustomerSegmentsPage = lazy(() =>
  import("@/pages/Dashboard/Customers/CustomerSegmentsPage").then((module) => ({
    default: module.CustomerSegmentsPage,
  }))
);
const FinancePage = lazy(() =>
  import("@/pages/Dashboard/Finance/FinancePage").then((module) => ({
    default: module.FinancePage,
  }))
);
const JobsManager = lazy(() =>
  import("@/pages/Dashboard/CMS/JobsManager").then((module) => ({
    default: module.JobsManager,
  }))
);
const JobForm = lazy(() =>
  import("@/pages/Dashboard/CMS/JobForm").then((module) => ({
    default: module.JobForm,
  }))
);
const LocationsManager = lazy(() =>
  import("@/pages/Dashboard/CMS/LocationsManager").then((module) => ({
    default: module.LocationsManager,
  }))
);
const LocationForm = lazy(() =>
  import("@/pages/Dashboard/CMS/LocationForm").then((module) => ({
    default: module.LocationForm,
  }))
);
const ApplicantsPage = lazy(() =>
  import("@/pages/Dashboard/Applicants/ApplicantsPage").then((module) => ({
    default: module.ApplicantsPage,
  }))
);

// User pages - lazy loaded
const RewardsPage = lazy(() =>
  import("@/pages/Rewards/RewardsPage").then((module) => ({
    default: module.RewardsPage,
  }))
);
const WishlistPage = lazy(() =>
  import("@/pages/Wishlist/WishlistPage").then((module) => ({
    default: module.WishlistPage,
  }))
);
const FavoritesPage = lazy(() =>
  import("@/pages/Favorites/FavoritesPage").then((module) => ({
    default: module.FavoritesPage,
  }))
);
const SettingsPage = lazy(() =>
  import("@/pages/Settings/SettingsPage").then((module) => ({
    default: module.SettingsPage,
  }))
);

// Checkout flow
const CheckoutPage = lazy(() =>
  import("@/pages/Checkout/CheckoutPage").then((module) => ({
    default: module.CheckoutPage,
  }))
);
const ThankYouPage = lazy(() =>
  import("@/pages/Checkout/ThankYouPage").then((module) => ({
    default: module.ThankYouPage,
  }))
);
const OrderHistoryPage = lazy(() =>
  import("@/pages/History/OrderHistoryPage").then((module) => ({
    default: module.OrderHistoryPage,
  }))
);
const OrderHistoryDetailPage = lazy(() =>
  import("@/pages/History/OrderHistoryDetailPage").then((module) => ({
    default: module.OrderHistoryDetailPage,
  }))
);

// About Sub-pages
const OurStoryPage = lazy(() =>
  import("@/pages/About/OurStoryPage").then((module) => ({
    default: module.OurStoryPage,
  }))
);
const CareersPage = lazy(() =>
  import("@/pages/About/CareersPage").then((module) => ({
    default: module.CareersPage,
  }))
);
const LocationsPage = lazy(() =>
  import("@/pages/About/LocationsPage").then((module) => ({
    default: module.LocationsPage,
  }))
);
const JobApplicationPage = lazy(() =>
  import("@/pages/About/JobApplicationPage").then((module) => ({
    default: module.JobApplicationPage,
  }))
);

// Auth Flow Pages
const ForgotPasswordPage = lazy(() =>
  import("@/features/auth/ForgotPasswordPage").then((module) => ({
    default: module.ForgotPasswordPage,
  }))
);
const VerifyOtpPage = lazy(() =>
  import("@/features/auth/VerifyOtpPage").then((module) => ({
    default: module.VerifyOtpPage,
  }))
);
const ResetPasswordPage = lazy(() =>
  import("@/features/auth/ResetPasswordPage").then((module) => ({
    default: module.ResetPasswordPage,
  }))
);

// Error Pages
const UnauthorizedPage = lazy(() =>
  import("@/pages/Error/UnauthorizedPage").then((module) => ({
    default: module.UnauthorizedPage,
  }))
);
const NotFoundPage = lazy(() =>
  import("@/pages/Error/NotFoundPage").then((module) => ({
    default: module.NotFoundPage,
  }))
);

// Suspense wrapper for lazy components
const LazyPage = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingScreen />}>
    <PageTransition>{children}</PageTransition>
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <PageTransition>
            <HomePage />
          </PageTransition>
        ),
      },
      {
        path: "menu",
        element: (
          <LazyPage>
            <MenuPage />
          </LazyPage>
        ),
      },
      {
        path: "product/:id",
        element: (
          <LazyPage>
            <ProductDetailPage />
          </LazyPage>
        ),
      },
      {
        path: "about",
        element: (
          <LazyPage>
            <OurStoryPage />
          </LazyPage>
        ),
      },
      {
        path: "about/careers",
        element: (
          <LazyPage>
            <CareersPage />
          </LazyPage>
        ),
      },
      {
        path: "about/careers/:jobId/apply",
        element: (
          <LazyPage>
            <JobApplicationPage />
          </LazyPage>
        ),
      },
      {
        path: "about/locations",
        element: (
          <LazyPage>
            <LocationsPage />
          </LazyPage>
        ),
      },
      {
        path: "rewards",
        element: (
          <ProtectedRoute>
            <LazyPage>
              <RewardsPage />
            </LazyPage>
          </ProtectedRoute>
        ),
      },
      {
        path: "favorites",
        element: (
          <ProtectedRoute>
            <LazyPage>
              <FavoritesPage />
            </LazyPage>
          </ProtectedRoute>
        ),
      },
      // Redirect /wishlist to /favorites for backward compatibility
      {
        path: "wishlist",
        element: <Navigate to="/favorites" replace />,
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <LazyPage>
              <SettingsPage />
            </LazyPage>
          </ProtectedRoute>
        ),
      },
      {
        path: "cart",
        element: <Navigate to="/checkout" replace />,
      },
      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            <LazyPage>
              <CheckoutPage />
            </LazyPage>
          </ProtectedRoute>
        ),
      },
      {
        path: "payment",
        element: <Navigate to="/checkout" replace />,
      },
      {
        path: "thank-you",
        element: (
          <ProtectedRoute>
            <LazyPage>
              <ThankYouPage />
            </LazyPage>
          </ProtectedRoute>
        ),
      },
      {
        path: "history",
        element: (
          <ProtectedRoute>
            <LazyPage>
              <OrderHistoryPage />
            </LazyPage>
          </ProtectedRoute>
        ),
      },
      {
        path: "history/:id",
        element: (
          <ProtectedRoute>
            <LazyPage>
              <OrderHistoryDetailPage />
            </LazyPage>
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: (
          <LazyPage>
            <LoginPage />
          </LazyPage>
        ),
      },
      {
        path: "register",
        element: (
          <LazyPage>
            <RegisterPage />
          </LazyPage>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <LazyPage>
            <ForgotPasswordPage />
          </LazyPage>
        ),
      },
      {
        path: "verify-otp",
        element: (
          <LazyPage>
            <VerifyOtpPage />
          </LazyPage>
        ),
      },
      {
        path: "reset-password",
        element: (
          <LazyPage>
            <ResetPasswordPage />
          </LazyPage>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute
            allowedRoles={["admin", "superadmin", "barista", "data_analyst"]}
          />
        ),
        children: [
          {
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <DashboardLayout />
              </Suspense>
            ),
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<LoadingScreen />}>
                    <DashboardHome />
                  </Suspense>
                ),
              },
              {
                path: "orders",
                element: (
                  <Suspense fallback={<LoadingScreen />}>
                    <BaristaView />
                  </Suspense>
                ),
              },
              {
                path: "logistics",
                element: (
                  <Suspense fallback={<LoadingScreen />}>
                    <LogisticsPage />
                  </Suspense>
                ),
              },
              {
                path: "analytics",
                element: (
                  <Suspense fallback={<LoadingScreen />}>
                    <AnalyticsPage />
                  </Suspense>
                ),
              },
              {
                path: "bi",
                element: (
                  <Suspense fallback={<LoadingScreen />}>
                    <BIPage />
                  </Suspense>
                ),
              },
              {
                path: "users",
                element: (
                  <Suspense fallback={<LoadingScreen />}>
                    <UsersPage />
                  </Suspense>
                ),
              },
              {
                path: "transactions",
                element: (
                  <Suspense fallback={<LoadingScreen />}>
                    <TransactionsPage />
                  </Suspense>
                ),
              },
              {
                path: "transactions/:id",
                element: (
                  <Suspense fallback={<LoadingScreen />}>
                    <OrderDetailAdmin />
                  </Suspense>
                ),
              },
              {
                path: "products",
                element: (
                  <Suspense fallback={<LoadingScreen />}>
                    <ProductList />
                  </Suspense>
                ),
              },
              {
                path: "products/new",
                element: (
                  <Suspense fallback={<LoadingScreen />}>
                    <ProductForm />
                  </Suspense>
                ),
              },
              {
                path: "products/:id",
                element: (
                  <Suspense fallback={<LoadingScreen />}>
                    <ProductForm />
                  </Suspense>
                ),
              },
              {
                path: "inventory",
                element: (
                  <Suspense fallback={<LoadingScreen />}>
                    <InventoryPage />
                  </Suspense>
                ),
              },
              {
                path: "inventory/new",
                element: (
                  <Suspense fallback={<LoadingScreen />}>
                    <AddInventoryItem />
                  </Suspense>
                ),
              },
              {
                path: "segments",
                element: (
                  <Suspense fallback={<LoadingScreen />}>
                    <CustomerSegmentsPage />
                  </Suspense>
                ),
              },
              {
                path: "finance",
                element: (
                  <Suspense fallback={<LoadingScreen />}>
                    <FinancePage />
                  </Suspense>
                ),
              },
              {
                path: "applicants",
                element: (
                  <Suspense fallback={<LoadingScreen />}>
                    <ApplicantsPage />
                  </Suspense>
                ),
              },
              {
                path: "cms/jobs",
                element: (
                  <Suspense fallback={<LoadingScreen />}>
                    <JobsManager />
                  </Suspense>
                ),
              },
              {
                path: "cms/jobs/new",
                element: (
                  <Suspense fallback={<LoadingScreen />}>
                    <JobForm />
                  </Suspense>
                ),
              },
              {
                path: "cms/jobs/:id",
                element: (
                  <Suspense fallback={<LoadingScreen />}>
                    <JobForm />
                  </Suspense>
                ),
              },
              {
                path: "cms/locations",
                element: (
                  <Suspense fallback={<LoadingScreen />}>
                    <LocationsManager />
                  </Suspense>
                ),
              },
              {
                path: "cms/locations/new",
                element: (
                  <Suspense fallback={<LoadingScreen />}>
                    <LocationForm />
                  </Suspense>
                ),
              },
              {
                path: "cms/locations/:id",
                element: (
                  <Suspense fallback={<LoadingScreen />}>
                    <LocationForm />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
      {
        path: "403",
        element: (
          <LazyPage>
            <UnauthorizedPage />
          </LazyPage>
        ),
      },
      {
        path: "404",
        element: (
          <LazyPage>
            <NotFoundPage />
          </LazyPage>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/404" replace />,
      },
    ],
  },
]);
