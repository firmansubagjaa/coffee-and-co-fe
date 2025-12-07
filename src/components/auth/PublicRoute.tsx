import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store";

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute - Protects auth pages from logged-in users
 *
 * Usage: Wrap login, register, verify-otp pages
 * If user is authenticated, redirect to home page
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, accessToken } = useAuthStore();

  // Check both isAuthenticated flag and accessToken
  if (isAuthenticated && accessToken) {
    // User already logged in, redirect to home
    return <Navigate to="/" replace />;
  }

  // User not logged in, allow access to auth pages
  return <>{children}</>;
};
