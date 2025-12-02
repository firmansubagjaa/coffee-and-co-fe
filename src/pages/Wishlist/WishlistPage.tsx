import React from 'react';
import { useWishlistStore } from '../../features/wishlist/store';
import { ProductCard } from '../../features/products/ProductCard';
import { Bookmark, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/Breadcrumb";

export const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { items: products } = useWishlistStore();

  return (
    <div className="min-h-screen bg-white dark:bg-coffee-950 pt-4 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink to="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Wishlist</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 sticky top-[120px] z-30 bg-white/95 dark:bg-coffee-950/95 backdrop-blur-sm py-4 md:static md:bg-transparent md:py-0">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-white tracking-tight flex items-center gap-3">
             <Bookmark className="h-8 w-8 text-coffee-600 dark:text-coffee-400 fill-coffee-600 dark:fill-coffee-400" />
            Your Wishlist <span className="text-lg text-coffee-400 dark:text-coffee-500 font-sans font-normal ml-2">({products.length})</span>
          </h1>
        </header>

        <div className="flex flex-col gap-10">
            <main className="flex-1">
                 {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-coffee-50 dark:bg-coffee-900 rounded-3xl text-center px-4">
                        <div className="w-16 h-16 bg-white dark:bg-coffee-800 rounded-full flex items-center justify-center mb-4 shadow-sm">
                            <Bookmark className="h-8 w-8 text-coffee-300 dark:text-coffee-500" />
                        </div>
                        <h3 className="text-xl font-bold text-coffee-900 dark:text-white mb-2">Your wishlist is empty</h3>
                        <p className="text-coffee-600 dark:text-coffee-300 mb-6 max-w-md">Save items you want to buy later by clicking the bookmark icon on any product.</p>
                        <Button onClick={() => navigate('/menu')}>Browse Menu</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>
        </div>
      </div>
    </div>
  );
};