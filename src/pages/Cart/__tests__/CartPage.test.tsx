import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartPage } from '../CartPage';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock store
const mockUpdateQuantity = vi.fn();
const mockRemoveFromCart = vi.fn();
const mockSetCheckoutDetails = vi.fn();

vi.mock('@/features/cart/store', () => ({
  useCartStore: () => ({
    items: [
      {
        cartId: '1',
        id: 'p1',
        name: 'Test Coffee',
        price: 10,
        quantity: 2,
        image: 'test.jpg',
        category: 'Coffee'
      }
    ],
    updateQuantity: mockUpdateQuantity,
    removeFromCart: mockRemoveFromCart,
    total: () => 20,
    setCheckoutDetails: mockSetCheckoutDetails,
  }),
}));

// Mock UI components
vi.mock('@/components/ui/Breadcrumb', () => ({
  Breadcrumb: ({ children }: any) => <div>{children}</div>,
  BreadcrumbList: ({ children }: any) => <div>{children}</div>,
  BreadcrumbItem: ({ children }: any) => <div>{children}</div>,
  BreadcrumbLink: ({ children }: any) => <div>{children}</div>,
  BreadcrumbPage: ({ children }: any) => <div>{children}</div>,
  BreadcrumbSeparator: () => <span>/</span>,
}));

vi.mock('@/components/ui/select', () => ({
  Select: ({ children }: any) => <div>{children}</div>,
  SelectTrigger: ({ children }: any) => <button>{children}</button>,
  SelectValue: () => <span>Select Value</span>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog: ({ children }: any) => <div>{children}</div>,
  AlertDialogTrigger: ({ children }: any) => <button>{children}</button>,
  AlertDialogContent: ({ children }: any) => <div>{children}</div>,
  AlertDialogHeader: ({ children }: any) => <div>{children}</div>,
  AlertDialogTitle: ({ children }: any) => <div>Title</div>,
  AlertDialogDescription: ({ children }: any) => <div>Desc</div>,
  AlertDialogFooter: ({ children }: any) => <div>{children}</div>,
  AlertDialogAction: ({ children }: any) => <button>{children}</button>,
  AlertDialogCancel: ({ children }: any) => <button>{children}</button>,
}));

vi.mock('@/components/ui/Tooltip', () => ({
  Tooltip: ({ children }: any) => <div>{children}</div>,
  TooltipTrigger: ({ children }: any) => <button>{children}</button>,
  TooltipContent: ({ children }: any) => <div>{children}</div>,
  TooltipProvider: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}));

vi.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
}));

describe('CartPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders checkout form and order summary', () => {
    render(
      <BrowserRouter>
          <CartPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /checkout/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByText('Test Coffee')).toBeInTheDocument();
    expect(screen.getByText(/\$20\.00/)).toBeInTheDocument(); // Subtotal
  });

  it('displays correct quantity', () => {
    render(
      <BrowserRouter>
          <CartPage />
      </BrowserRouter>
    );
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
