import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardLayout } from '../DashboardLayout';
import { BrowserRouter } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store';

// Mock dependencies
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock Auth Store
vi.mock('@/features/auth/store', () => ({
  useAuthStore: () => ({
    user: { name: 'Test Admin', role: 'admin' },
    logout: vi.fn(),
  }),
}));

// Mock Lucide Icons to avoid rendering issues
vi.mock('lucide-react', () => ({
  LayoutDashboard: () => <span data-testid="icon-dashboard" />,
  Coffee: () => <span data-testid="icon-coffee" />,
  Truck: () => <span data-testid="icon-truck" />,
  BarChart3: () => <span data-testid="icon-analytics" />,
  PieChart: () => <span data-testid="icon-bi" />,
  Users: () => <span data-testid="icon-users" />,
  Receipt: () => <span data-testid="icon-transactions" />,
  Package: () => <span data-testid="icon-products" />,
  Layers: () => <span data-testid="icon-inventory" />,
  Wallet: () => <span data-testid="icon-finance" />,
  Briefcase: () => <span data-testid="icon-jobs" />,
  MapPin: () => <span data-testid="icon-locations" />,
  LogOut: () => <span data-testid="icon-logout" />,
  Menu: () => <span data-testid="icon-menu" />,
  X: () => <span data-testid="icon-close" />,
  ChevronRight: () => <span data-testid="icon-chevron" />,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    aside: ({ children, ...props }: any) => <aside {...props}>{children}</aside>,
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}));

describe('DashboardLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sidebar with navigation links', () => {
    render(
      <BrowserRouter>
        <DashboardLayout />
      </BrowserRouter>
    );

    // Check for sidebar items
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Logistics')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    
    // Check for user profile
    expect(screen.getByText('Test Admin')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('navigates to correct path when link is clicked', () => {
    render(
      <BrowserRouter>
        <DashboardLayout />
      </BrowserRouter>
    );

    const ordersLink = screen.getByText('Orders').closest('a');
    expect(ordersLink).toHaveAttribute('href', '/dashboard/orders');
  });

  it('toggles sidebar on menu click', () => {
    render(
      <BrowserRouter>
        <DashboardLayout />
      </BrowserRouter>
    );

    // Initially open: Sidebar title + Mobile title = 2
    const titles = screen.getAllByText('Coffee & Co.');
    expect(titles).toHaveLength(2);

    const toggleButtons = screen.getAllByTestId('icon-menu');
    const toggleButton = toggleButtons[0].closest('button');
    fireEvent.click(toggleButton!);

    // After toggle: Sidebar title hidden/removed + Mobile title = 1
    const titlesAfter = screen.getAllByText('Coffee & Co.');
    expect(titlesAfter).toHaveLength(1);
  });
});
