import React, { memo, useCallback } from "react";
import { Product } from "@/types";
import { Button } from "../../components/common/Button";
import { useAddToCart } from "@/api";  // ✅ Backend hook
import { useFavoritesStore } from "../../features/favorites/store";
import { useWishlistStore } from "../../features/wishlist/store";
import { useAuthStore } from "../../features/auth/store";
import { useLanguage } from "../../contexts/LanguageContext";
import { CURRENCY } from "../../utils/constants";
import { Star, Plus, Eye, Heart, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { Carousel } from "../../components/ui/Carousel";
import { Link, useNavigate } from "react-router-dom";
import { TRANSITIONS } from "../../utils/animations";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/Tooltip";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = memo(({ product }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const addToCartMutation = useAddToCart();  // ✅ Backend mutation
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const favorite = isFavorite(product.id);
  const inWishlist = isInWishlist(product.id);
  const displayImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isAuthenticated) {
        toast.error("Please log in", {
          description: "You need to be logged in to add items to your order.",
        });
        navigate("/login");
        return;
      }

      // ✅ Use backend mutation
      addToCartMutation.mutate(
        {
          productId: product.id,
          quantity: 1,
        },
        {
          onSuccess: () => {
            toast.success(t("product.addedToCart"));
          },
          onError: (error: any) => {
            toast.error(t("common.error"), {
              description: error.message || "Failed to add item to cart",
            });
          },
        }
      );
    },
    [addToCartMutation, isAuthenticated, navigate, product.id, t]
  );

  const handleToggleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isAuthenticated) {
        toast.error("Please log in", {
          description: "You need to be logged in to save favorites.",
        });
        navigate("/login");
        return;
      }

      toggleFavorite(product);
      if (!favorite) {
        toast.success("Added to favorites", {
          description: `${product.name} saved for later.`,
        });
      } else {
        toast.info("Removed from favorites", {
          description: `${product.name} removed from your collection.`,
        });
      }
    },
    [isAuthenticated, navigate, toggleFavorite, product, favorite]
  );

  const handleToggleWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isAuthenticated) {
        toast.error("Please log in", {
          description: "You need to be logged in to manage your wishlist.",
        });
        navigate("/login");
        return;
      }

      toggleWishlist(product);
      if (!inWishlist) {
        toast.success("Added to wishlist", {
          description: `${product.name} bookmarked.`,
        });
      } else {
        toast.info("Removed from wishlist", {
          description: `${product.name} removed from your wishlist.`,
        });
      }
    },
    [isAuthenticated, navigate, toggleWishlist, product, inWishlist]
  );

  const isPending = addToCartMutation.isPending;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={TRANSITIONS.spring}
      className="group bg-white dark:bg-[#3C2A21] rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden border border-coffee-50 dark:border-none flex flex-col h-full relative"
      aria-label={`${product.name}, ${CURRENCY}${product.price.toFixed(
        2
      )}, Rating ${product.rating} out of 5`}
    >
      <div className="p-4">
        <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-coffee-50 dark:bg-transparent shadow-inner">
          {/* Link wrapper */}
          <Link
            to={`/product/${product.id}`}
            className="block w-full h-full relative"
          >
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
                className="pointer-events-auto shadow-lg bg-white/90 dark:bg-white/90 backdrop-blur-md hover:bg-coffee-900 hover:text-white dark:hover:bg-white dark:hover:text-coffee-900 text-coffee-900 border-none rounded-full px-6 font-bold"
                disabled={isPending}
              >
                {isPending ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                )}
                {t("product.addToOrder")}
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
                  className="p-2.5 rounded-full bg-white/80 dark:bg-[#2C1A11]/60 backdrop-blur-md shadow-sm border border-white/20 dark:border-none hover:bg-white dark:hover:bg-[#2C1A11]/80 transition-colors"
                  aria-label={
                    favorite ? "Remove from favorites" : "Add to favorites"
                  }
                >
                  <motion.div
                    initial={false}
                    animate={{ scale: favorite ? [1, 1.4, 1] : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors ${
                        favorite
                          ? "fill-error text-error"
                          : "text-coffee-900 dark:text-white"
                      }`}
                      aria-hidden="true"
                    />
                  </motion.div>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{favorite ? "Remove from Favorites" : "Add to Favorites"}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-[#2C1A11]/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 z-20 pointer-events-none border border-white/20 dark:border-none shadow-sm">
            <Star
              className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
              aria-hidden="true"
            />
            <span
              className="text-xs font-bold text-coffee-900 dark:text-white"
              aria-label={`Rating ${product.rating} out of 5`}
            >
              {product.rating}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-2 flex flex-col flex-1">
        <Link
          to={`/product/${product.id}`}
          className="block transition-colors flex-1 group-hover:text-coffee-700 dark:group-hover:text-coffee-300"
        >
          <div className="mb-3">
            <p className="text-[10px] text-coffee-500 dark:text-white/50 uppercase tracking-[0.2em] font-bold mb-2">
              {product.category}
            </p>
            <h3 className="font-serif text-xl font-bold text-coffee-900 dark:text-white leading-tight mb-2 line-clamp-1">
              {product.name}
            </h3>
          </div>

          <div
            className="text-sm text-coffee-600 dark:text-white/70 mb-6 h-10 line-clamp-2 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />

          <div className="flex items-center justify-between mt-auto">
            <span className="font-serif font-bold text-2xl text-coffee-900 dark:text-white">
              {CURRENCY}
              {product.price.toFixed(2)}
            </span>

            {/* Mobile Add Button */}
            <button
              onClick={handleAddToCart}
              className="md:hidden p-3 bg-coffee-100 dark:bg-white/10 rounded-full text-coffee-900 dark:text-white active:scale-95 transition-transform hover:bg-coffee-200 dark:hover:bg-white/20"
              aria-label={`Add ${product.name} to cart`}
              disabled={isPending}
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Plus className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </Link>
      </div>
    </motion.article>
  );
});

ProductCard.displayName = "ProductCard";
