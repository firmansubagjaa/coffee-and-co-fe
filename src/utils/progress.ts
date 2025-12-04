import { useEffect } from "react";
import { useLocation, useNavigation } from "react-router-dom";
import NProgress from "nprogress";

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  minimum: 0.1,
  easing: "ease",
  speed: 300,
  trickleSpeed: 200,
});

/**
 * Hook to show progress bar during route transitions
 * Uses React Router's navigation state
 */
export const useNavigationProgress = () => {
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "loading") {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [navigation.state]);
};

/**
 * Hook to show progress bar on route change
 * For simpler use cases without data loading
 */
export const useRouteProgress = () => {
  const location = useLocation();

  useEffect(() => {
    NProgress.done();
  }, [location.pathname]);
};

/**
 * Component version for use in Router
 */
export const NavigationProgress: React.FC = () => {
  useNavigationProgress();
  return null;
};

/**
 * Start progress manually (for async operations)
 */
export const startProgress = () => NProgress.start();

/**
 * Complete progress manually
 */
export const doneProgress = () => NProgress.done();

/**
 * Increment progress manually
 */
export const incProgress = (amount?: number) => NProgress.inc(amount);
