import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store";
import { Role } from "@/types";

import { Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: Role[];
  children?: React.ReactNode; // Keep for backward compatibility if used as wrapper
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // If children are provided, render them (legacy usage)
  if (children) {
    return <>{children}</>;
  }

  // Otherwise render Outlet (layout usage)
  return <Outlet />;
};
