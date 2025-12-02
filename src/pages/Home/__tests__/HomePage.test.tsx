import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomePage } from '../HomePage';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock child components to avoid deep rendering issues
vi.mock('../Hero', () => ({
  Hero: () => <div data-testid="hero-section">Hero Section</div>
}));

vi.mock('../../../features/products/ProductCard', () => ({
  ProductCard: ({ product }: { product: any }) => (
    <div data-testid="product-card">{product.name}</div>
  )
}));

// Mock API/Query
const mockProducts = [
  { id: '1', name: 'Coffee A', price: 10, image: 'img1.jpg' },
  { id: '2', name: 'Coffee B', price: 12, image: 'img2.jpg' }
];

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: () => ({
      data: mockProducts,
      isLoading: false,
      error: null
    })
  };
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders hero section and weekly favorites', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </QueryClientProvider>
    );

    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByText('Weekly Favorites')).toBeInTheDocument();
    expect(screen.getByText('Top picks from our master roasters.')).toBeInTheDocument();
  });

  it('renders product cards from query data', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </QueryClientProvider>
    );

    expect(screen.getAllByTestId('product-card')).toHaveLength(2);
    expect(screen.getByText('Coffee A')).toBeInTheDocument();
    expect(screen.getByText('Coffee B')).toBeInTheDocument();
  });
});
