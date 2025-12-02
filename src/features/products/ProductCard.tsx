
import React from 'react';
import { Product } from '@/types';
import { Button } from '../../components/common/Button';
import { useCartStore } from '../../features/cart/store';
import { useFavoritesStore } from '../../features/favorites/store';
import { useWishlistStore } from '../../features/wishlist/store';
import { useAuthStore } from '../../features/auth/store';
import { useLanguage } from '../../contexts/LanguageContext';
import { CURRENCY } from '../../utils/constants';
import { Star, Plus, Eye, Heart, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { Carousel } from '../../components/ui/Carousel';
import { Link, useNavigate } from 'react-router-dom';
import { TRANSITIONS } from '../../utils/animations';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/Tooltip';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  
  const favorite = isFavorite(product.id);
  const inWishlist = isInWishlist(product.id);
  const displayImages = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
        toast.error("Please log in", {
            description: "You need to be logged in to add items to your order."
        });
        navigate('/login');
        return;
    }

    addToCart(product);
    toast.success("Added to cart", {
      description: `${product.name} has been added to your order.`,
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
        toast.error("Please log in", {
            description: "You need to be logged in to save favorites."
        });
        navigate('/login');
        return;
    }

    toggleFavorite(product);
    if (!favorite) {
        toast.success("Added to favorites", {
            description: `${product.name} saved for later.`
        });
    } else {
        toast.info("Removed from favorites", {
            description: `${product.name} removed from your collection.`
        });
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
        toast.error("Please log in", {
            description: "You need to be logged in to manage your wishlist."
        });
        navigate('/login');
        return;
    }

    toggleWishlist(product);
    if (!inWishlist) {
        toast.success("Added to wishlist", {
            description: `${product.name} bookmarked.`
        });
    } else {
        toast.info("Removed from wishlist", {
            description: `${product.name} removed from your wishlist.`
        });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={TRANSITIONS.spring}
      className="group bg-white dark:bg-coffee-800 rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden border border-coffee-50 dark:border-coffee-700 flex flex-col h-full relative"
    >
      <div className="p-3">
        <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-coffee-50 dark:bg-coffee-900 shadow-inner">
            {/* Link wrapper */}
            <Link to={`/product/${product.id}`} className="block w-full h-full relative">
                 <Carousel 
                    images={displayImages} 
                    alt={product.name} 
                    className="w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Quick Add Overlay - Desktop */}
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 hidden md:flex justify-center z-10 pointer-events-none">
                    <Button 
                        size="sm"
                        onClick={handleAddToCart}
                        className="pointer-events-auto shadow-lg bg-white/90 dark:bg-coffee-800/90 backdrop-blur-md hover:bg-coffee-900 hover:text-white dark:hover:bg-coffee-100 dark:hover:text-coffee-900 text-coffee-900 dark:text-white border-none rounded-full px-6"
                    >
                        <Plus className="h-4 w-4 mr-2" /> {t('product.addToOrder')}
                    </Button>
                </div>
            </Link>
            
            {/* Top Left Actions */}
            <div className="absolute top-3 left-3 z-20 flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleToggleFavorite}
                        className="p-2.5 rounded-full bg-white/80 dark:bg-coffee-800/80 backdrop-blur-md shadow-sm border border-white/20 dark:border-coffee-700 hover:bg-white dark:hover:bg-coffee-700 transition-colors"
                        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        <motion.div
                            initial={false}
                            animate={{ scale: favorite ? [1, 1.4, 1] : 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Heart className={`h-4 w-4 transition-colors ${favorite ? 'fill-red-500 text-red-500' : 'text-coffee-900 dark:text-coffee-100'}`} />
                        </motion.div>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{favorite ? "Remove from Favorites" : "Add to Favorites"}</p>
                  </TooltipContent>
                </Tooltip>
            </div>

            {/* Rating Badge */}
            <div className="absolute top-3 right-3 bg-white/90 dark:bg-coffee-900/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm z-20 pointer-events-none border border-white/20 dark:border-coffee-700">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-bold text-coffee-900 dark:text-coffee-100">{product.rating}</span>
            </div>
        </div>
      </div>
      
      <div className="px-5 pb-5 pt-2 flex flex-col flex-1">
        <Link to={`/product/${product.id}`} className="block group-hover:text-coffee-700 dark:group-hover:text-coffee-300 transition-colors flex-1">
            <div className="mb-2">
                <p className="text-[10px] text-coffee-500 dark:text-coffee-400 uppercase tracking-[0.2em] font-bold mb-1">{product.category}</p>
                <h3 className="font-serif text-lg font-bold text-coffee-900 dark:text-coffee-100 leading-tight group-hover:text-coffee-700 dark:group-hover:text-coffee-300 transition-colors line-clamp-1">{product.name}</h3>
            </div>
            
            <div className="text-sm text-coffee-600 dark:text-coffee-400 mb-4 h-10 line-clamp-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
            
            <div className="flex items-center justify-between mt-auto">
                <span className="font-bold text-lg text-coffee-900 dark:text-white">
                    {CURRENCY}{product.price.toFixed(2)}
                </span>
                
                {/* Mobile Add Button */}
                <button 
                    onClick={handleAddToCart}
                    className="md:hidden p-2 bg-coffee-100 dark:bg-coffee-800 rounded-full text-coffee-900 dark:text-white active:scale-95 transition-transform"
                >
                    <Plus className="h-5 w-5" />
                </button>
            </div>
        </Link>
      </div>
    </motion.div>
  );
};
