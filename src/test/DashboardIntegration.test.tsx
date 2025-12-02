import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '../pages/Dashboard/DashboardLayout';
import { useAuthStore } from '@/features/auth/store';

// Mock Auth Store
vi.mock('@/features/auth/store', () => ({
  useAuthStore: () => ({
    user: { name: 'Test Admin', role: 'admin' },
    logout: vi.fn(),
  }),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    aside: ({ children, ...props }: any) => <aside {...props}>{children}</aside>,
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}));

// Mock Lucide Icons
vi.mock('lucide-react', () => ({
  LayoutDashboard: () => <span>Icon</span>,
  Coffee: () => <span>Icon</span>,
  Truck: () => <span>Icon</span>,
  BarChart3: () => <span>Icon</span>,
  PieChart: () => <span>Icon</span>,
  Users: () => <span>Icon</span>,
  Receipt: () => <span>Icon</span>,
  Package: () => <span>Icon</span>,
  Layers: () => <span>Icon</span>,
  Wallet: () => <span>Icon</span>,
  Briefcase: () => <span>Icon</span>,
  MapPin: () => <span>Icon</span>,
  LogOut: () => <span>Icon</span>,
  Menu: () => <span data-testid="icon-menu">Menu</span>,
  X: () => <span>Icon</span>,
  ChevronRight: () => <span>Icon</span>,
}));

describe('Dashboard Routing Integration', () => {
  it('navigates to nested routes with AnimatePresence', async () => {
    const TestApp = () => {
      // We need to use useLocation inside a Router context
      return (
        <RouteWrapper />
      );
    };

    const RouteWrapper = () => {
        const { useLocation, Routes, Route } = require('react-router-dom');
        const location = useLocation();
        return (
            <Routes location={location}>
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<div data-testid="dashboard-home">Dashboard Home</div>} />
                    <Route path="orders" element={<div data-testid="orders-page">Orders Page</div>} />
                </Route>
            </Routes>
        );
    }

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <TestApp />
      </MemoryRouter>
    );

    // Initial render
    expect(screen.getByTestId('dashboard-home')).toBeInTheDocument();

    // Click on Orders link
    const ordersLink = screen.getByText('Orders');
    fireEvent.click(ordersLink);

    // Verify navigation
    await waitFor(() => {
      expect(screen.getByTestId('orders-page')).toBeInTheDocument();
    });
    
    // Verify Home is gone
    expect(screen.queryByTestId('dashboard-home')).not.toBeInTheDocument();
  });
});
