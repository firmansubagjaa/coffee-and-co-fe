# Contoh Penggunaan EmptyState untuk Product

## 1. Di Carousel (Home Page)

```tsx
import { EmptyProducts } from '@/components/common/EmptyState';
import { useProducts } from '@/api';

export const FeaturedCarousel = () => {
  const { data, isLoading, error } = useProducts({ limit: 10 });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Jika tidak ada produk
  if (!data?.products || data.products.length === 0) {
    return <EmptyProducts size="sm" className="min-h-[300px]" />;
  }

  return (
    <div className="carousel">
      {/* Render products */}
    </div>
  );
};
```

## 2. Di Menu Page

```tsx
import { EmptyProducts, NoFilterMatch } from '@/components/common/EmptyState';
import { useProducts } from '@/api';

export const MenuPage = () => {
  const [filters, setFilters] = useState({});
  const { data, isLoading } = useProducts(filters);
  
  const hasActiveFilters = Object.keys(filters).length > 0;

  if (isLoading) {
    return <LoadingState />;
  }

  // Jika tidak ada produk sama sekali
  if (!data?.products || data.products.length === 0) {
    if (hasActiveFilters) {
      // Filter tidak menemukan hasil
      return (
        <NoFilterMatch 
          onClearFilters={() => setFilters({})} 
        />
      );
    } else {
      // Belum ada produk di database
      return <EmptyProducts size="lg" />;
    }
  }

  return (
    <div className="grid">
      {/* Render products */}
    </div>
  );
};
```

## 3. Komponen yang Tersedia

### EmptyProducts
- **Use case**: Ketika database belum ada produk sama sekali
- **Props**: 
  - `className?: string`
  - `size?: "sm" | "md" | "lg"` (default: "md")
- **Action**: Refresh halaman

### NoFilterMatch
- **Use case**: Ketika filter tidak menemukan hasil
- **Props**:
  - `className?: string`
  - `onClearFilters?: () => void`
- **Action**: Hapus semua filter

### NoSearchResults
- **Use case**: Ketika search tidak menemukan hasil
- **Props**: 
  - `query?: string`
  - `onClear?: () => void`
  - `className?: string`
