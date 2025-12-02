
import React from 'react';
import { useAuthStore } from '../../features/auth/store';
import { BaristaView } from './BaristaView';
import { AdminView } from './AdminView';
import { Navigate } from 'react-router-dom';

export const DashboardHome: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" />;

  if (user.role === 'barista') {
    return <BaristaView />;
  }

  if (['admin', 'superadmin'].includes(user.role)) {
    return <AdminView />;
  }

  return <Navigate to="/" />;
};
