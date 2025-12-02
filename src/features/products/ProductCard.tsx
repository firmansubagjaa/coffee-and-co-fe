
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
      <div className="p-4">
        <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-coffee-50 dark:bg-coffee-900 shadow-inner">
            {/* Link wrapper */}
            <Link to={`/product/${product.id}`} className="block w-full h-full relative">
                 <Carousel 
                    images={displayImages} 
                    alt={product.name} 
                    className="w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Quick View Overlay - Desktop Only */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center z-10 pointer-events-none">
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white/95 dark:bg-coffee-900/95 backdrop-blur-xl px-6 py-3 rounded-full flex items-center gap-2 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                    >
                        <Eye className="h-4 w-4 text-coffee-800 dark:text-coffee-200" />
                        <span className="text-sm font-bold text-coffee-900 dark:text-coffee-100 tracking-wide uppercase text-[10px]">Quick View</span>
                    </motion.div>
                </div>
            </Link>
            
            {/* Top Left Actions */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleToggleFavorite}
                        className="p-2.5 rounded-full bg-white/90 dark:bg-coffee-800/90 backdrop-blur-md shadow-lg border border-white/20 dark:border-coffee-700 hover:bg-white dark:hover:bg-coffee-700 transition-colors"
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

                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleToggleWishlist}
                        className="p-2.5 rounded-full bg-white/90 dark:bg-coffee-800/90 backdrop-blur-md shadow-lg border border-white/20 dark:border-coffee-700 hover:bg-white dark:hover:bg-coffee-700 transition-colors"
                        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <motion.div
                            initial={false}
                            animate={{ rotate: inWishlist ? [0, -15, 15, 0] : 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Bookmark className={`h-4 w-4 transition-colors ${inWishlist ? 'fill-coffee-600 text-coffee-600' : 'text-coffee-900 dark:text-coffee-100'}`} />
                        </motion.div>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}</p>
                  </TooltipContent>
                </Tooltip>
            </div>

            {/* Rating Badge */}
            <div className="absolute top-4 right-4 bg-white/90 dark:bg-coffee-900/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg z-20 pointer-events-none border border-white/20 dark:border-coffee-700">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-bold text-coffee-900 dark:text-coffee-100">{product.rating}</span>
            </div>
        </div>
      </div>
      
      <div className="px-6 pb-6 pt-2 flex flex-col flex-1">
        <Link to={`/product/${product.id}`} className="block group-hover:text-coffee-700 dark:group-hover:text-coffee-300 transition-colors flex-1">
            <div className="flex justify-between items-start mb-3">
                <div className="space-y-1">
                    <p className="text-[10px] text-coffee-500 dark:text-coffee-400 uppercase tracking-[0.2em] font-bold">{product.category}</p>
                    <h3 className="font-serif text-xl font-bold text-coffee-900 dark:text-coffee-100 leading-tight group-hover:text-coffee-700 dark:group-hover:text-coffee-300 transition-colors">{product.name}</h3>
                </div>
                <span className="font-bold text-coffee-900 dark:text-coffee-100 bg-coffee-100 dark:bg-coffee-900/50 px-3 py-1 rounded-full text-sm border border-coffee-200 dark:border-coffee-700">
                    {CURRENCY}{product.price.toFixed(2)}
                </span>
            </div>
            
            <div className="text-sm text-coffee-600 dark:text-coffee-400 mb-6 h-10 line-clamp-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
            
            {/* Show Tasting Notes if available (Small teaser) */}
            {product.tastingNotes && product.tastingNotes.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                    {product.tastingNotes.slice(0, 2).map((note, i) => (
                        <span key={i} className="text-[10px] uppercase tracking-wider font-medium bg-cream-100 dark:bg-coffee-900/50 text-coffee-700 dark:text-coffee-300 px-2.5 py-1 rounded-md border border-coffee-100 dark:border-coffee-800">
                            {note}
                        </span>
                    ))}
                </div>
            )}
        </Link>

        <Button 
          variant="outline" 
          fullWidth 
          onClick={handleAddToCart}
          className="h-12 border-coffee-200 dark:border-coffee-700 text-coffee-700 dark:text-coffee-300 group-hover:bg-coffee-900 dark:group-hover:bg-coffee-100 group-hover:!text-white dark:group-hover:!text-coffee-900 group-hover:border-coffee-900 dark:group-hover:border-coffee-100 active:scale-95 transition-all duration-300 relative z-20 font-medium tracking-wide"
        >
          <span className="flex items-center gap-2">
            {t('addToCart')} <Plus className="h-4 w-4" />
          </span>
        </Button>
      </div>
    </motion.div>
  );
};
