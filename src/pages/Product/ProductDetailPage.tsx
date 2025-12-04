import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById, fetchRelatedProducts } from "../../services/api";
import { Button } from "../../components/common/Button";
import { useCartStore } from "../../features/cart/store";
import { useFavoritesStore } from "../../features/favorites/store";
import { useAuthStore } from "../../features/auth/store";
import { CURRENCY } from "../../utils/constants";
import {
  Star,
  Truck,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  Heart,
  ShoppingBag,
  AlertCircle,
  X,
  Maximize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "../../features/products/ProductCard";
import { ImageZoom } from "../../components/ui/ImageZoom";
import { ReviewSection } from "../../features/reviews/ReviewSection";
import { SEO } from "@/components/common/SEO";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/Breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/Tooltip";
import { toast } from "sonner";
import { useLanguage } from "../../contexts/LanguageContext";

// --- Components ---

const DetailAccordion: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-coffee-100 dark:border-coffee-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 text-left font-medium text-coffee-900 dark:text-white hover:text-coffee-600 dark:hover:text-coffee-300 transition-colors"
      >
        <h3 className="text-lg font-serif font-bold text-coffee-900 dark:text-white">
          {title}
        </h3>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-sm text-coffee-600 dark:text-coffee-300 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { isAuthenticated } = useAuthStore();
  const [quantity, setQuantity] = useState(1);
  const { t } = useLanguage();

  // Default selections
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedGrind, setSelectedGrind] = useState<string>("");
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id || ""),
    enabled: !!id,
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ["related-products", id],
    queryFn: () => fetchRelatedProducts(id || ""),
    enabled: !!id,
  });

  // Reset state when product changes
  useEffect(() => {
    setMainImageIndex(0);
    setQuantity(1);
  }, [id]);

  // Set default variants when product loads
  useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0)
        setSelectedSize(product.sizes[1] || product.sizes[0]);
      if (product.grindOptions && product.grindOptions.length > 0)
        setSelectedGrind(product.grindOptions[0]);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-coffee-950">
        <div className="animate-spin text-4xl">☕</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-coffee-950 gap-4 text-center px-4">
        <div className="p-4 rounded-full bg-error/10 text-error">
          <AlertCircle className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-coffee-900 dark:text-white">
          {t("product.oops")}
        </h2>
        <p className="text-coffee-600 dark:text-coffee-300 max-w-md">
          {t("product.loadError")}
        </p>
        <div className="flex gap-3 mt-2">
          <Button onClick={() => refetch()} variant="primary">
            {t("product.tryAgain")}
          </Button>
          <Button onClick={() => navigate("/menu")} variant="outline">
            {t("product.backToMenu")}
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-coffee-950 text-coffee-900 dark:text-white">
        {t("product.notFound")}
      </div>
    );
  }

  const favorite = isFavorite(product.id);
  const displayImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error(t("product.loginRequired"), {
        description: t("product.loginDesc"),
      });
      navigate("/login");
      return;
    }

    // Logic to pass selected variants to cart would go here
    // For now adding basic product
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    let desc = `${quantity}x ${product.name}`;
    if (selectedSize) desc += ` (${selectedSize})`;
    if (selectedGrind) desc += ` - ${selectedGrind}`;

    toast.success(t("product.addedToCart"), {
      description: t("product.addedToCartDesc", { desc }),
    });
  };

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast.error(t("product.loginRequired"), {
        description: t("product.loginFavDesc"),
      });
      navigate("/login");
      return;
    }
    toggleFavorite(product);
    if (!favorite) {
      toast.success(t("product.addedToFav"), {
        description: t("product.saved", { name: product.name }),
      });
    } else {
      toast.info(t("product.removedFromFav"));
    }
  };

  return (
    <div className="bg-white dark:bg-coffee-950 min-h-screen pb-32 md:pb-20 relative">
      <div className="container mx-auto px-4 md:px-8 pt-6">
        {/* Breadcrumbs */}
        <div className="mb-6 md:mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink to="/">{t("nav.home")}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink to="/menu">{t("nav.menu")}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  to={`/menu?category=${product.category}`}
                  className="capitalize"
                >
                  {product.category}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">
                  {product.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 mb-20">
          {/* Left Column: Gallery */}
          <div className="w-full lg:w-3/5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4 md:space-y-6"
            >
              {/* Main Image with Zoom */}
              <div className="relative aspect-square md:aspect-[4/3] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-coffee-50 dark:bg-coffee-900 shadow-sm group touch-none">
                <motion.div
                  key={mainImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  <ImageZoom
                    src={displayImages[mainImageIndex]}
                    alt={product.name}
                    onClick={() => setIsLightboxOpen(true)}
                  />
                </motion.div>

                <div className="absolute top-4 right-4 md:top-6 md:right-6 flex gap-3 z-20 pointer-events-none">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleToggleFavorite();
                        }}
                        className="p-2.5 md:p-3 bg-white/90 dark:bg-coffee-800/90 backdrop-blur-sm rounded-full shadow-md text-coffee-900 dark:text-white pointer-events-auto border border-white/20 dark:border-coffee-700"
                      >
                        <motion.div
                          initial={false}
                          animate={{ scale: favorite ? [1, 1.4, 1] : 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Heart
                            className={`h-5 w-5 transition-colors ${
                              favorite
                                ? "fill-error text-error"
                                : "text-coffee-900 dark:text-white"
                            }`}
                          />
                        </motion.div>
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {favorite
                          ? t("product.removeFromFavorites")
                          : t("product.addToFavorites")}
                      </p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setIsLightboxOpen(true)}
                        className="p-2.5 md:p-3 bg-white/90 dark:bg-coffee-800/90 backdrop-blur-sm rounded-full shadow-md text-coffee-900 dark:text-white hover:scale-110 transition-all pointer-events-auto"
                      >
                        <Maximize2 className="h-5 w-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("product.expandImage")}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Thumbnails */}
              {displayImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
                  {displayImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMainImageIndex(idx)}
                      className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                        mainImageIndex === idx
                          ? "border-coffee-900 dark:border-coffee-400 shadow-md ring-1 ring-coffee-900 dark:ring-coffee-400"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`View ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="w-full lg:w-2/5">
            <div className="lg:sticky lg:top-28">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm font-bold tracking-wider text-coffee-500 dark:text-coffee-400 uppercase">
                    {product.category}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-coffee-300 dark:bg-coffee-600"></span>
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="text-sm font-bold ml-1 text-coffee-900 dark:text-white">
                      {product.rating}
                    </span>
                    <span className="text-xs text-coffee-400 ml-1">
                      (42 {t("product.reviews")})
                    </span>
                  </div>
                </div>

                <h1 className="text-3xl md:text-5xl font-serif font-bold text-coffee-900 dark:text-white mb-4 leading-tight">
                  {product.name}
                </h1>
                <p className="text-2xl md:text-3xl font-bold text-coffee-800 dark:text-coffee-100 mb-6">
                  {CURRENCY}
                  {product.price.toFixed(2)}
                </p>

                <div className="space-y-6 md:space-y-8 mb-8">
                  {/* Size Selector */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div>
                      <label className="block text-sm font-bold text-coffee-900 dark:text-white mb-3">
                        {t("product.size")}
                      </label>
                      <div className="flex gap-3">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center font-bold text-lg border-2 transition-all ${
                              selectedSize === size
                                ? "border-coffee-900 bg-coffee-900 text-white dark:bg-coffee-100 dark:text-coffee-900 dark:border-coffee-100"
                                : "border-coffee-100 dark:border-coffee-700 text-coffee-600 dark:text-coffee-300 hover:border-coffee-300 dark:hover:border-coffee-500"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Grind Selector (Only if available) */}
                  {product.grindOptions && product.grindOptions.length > 0 && (
                    <div>
                      <label className="block text-sm font-bold text-coffee-900 dark:text-white mb-3">
                        {t("product.grind")}
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {product.grindOptions.map((type) => (
                          <button
                            key={type}
                            onClick={() => setSelectedGrind(type)}
                            className={`py-3 px-2 md:px-4 rounded-xl text-sm font-medium border-2 transition-all text-center ${
                              selectedGrind === type
                                ? "border-coffee-900 bg-coffee-50 text-coffee-900 dark:bg-coffee-800 dark:text-white dark:border-coffee-600"
                                : "border-coffee-100 dark:border-coffee-700 text-coffee-600 dark:text-coffee-300 hover:border-coffee-300 dark:hover:border-coffee-500"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop Actions */}
                <div className="hidden lg:flex flex-col sm:flex-row gap-4 mb-10 pb-8 border-b border-coffee-100 dark:border-coffee-800">
                  <div className="flex items-center bg-coffee-50 dark:bg-coffee-800 rounded-full p-1 w-max border border-coffee-100 dark:border-coffee-700">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-coffee-700 text-coffee-900 dark:text-white shadow-sm hover:scale-105 transition-transform"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-lg text-coffee-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-coffee-700 text-coffee-900 dark:text-white shadow-sm hover:scale-105 transition-transform"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <Button
                    size="lg"
                    fullWidth
                    onClick={handleAddToCart}
                    className="shadow-xl shadow-coffee-900/10 hover:shadow-coffee-900/20 gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {t("product.addToOrder")} - {CURRENCY}
                    {(product.price * quantity).toFixed(2)}
                  </Button>
                </div>

                {/* Details Accordions */}
                <div className="space-y-1">
                  <DetailAccordion title={t("product.description")} defaultOpen>
                    <div
                      className="prose prose-sm prose-p:text-coffee-600 dark:prose-p:text-coffee-300 prose-headings:text-coffee-900 dark:prose-headings:text-white"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  </DetailAccordion>

                  {(product.origin ||
                    product.roastLevel ||
                    product.tastingNotes) && (
                    <DetailAccordion title={t("product.originRoast")}>
                      <div className="space-y-2">
                        {product.origin && (
                          <p>
                            <span className="font-bold text-coffee-900 dark:text-white">
                              {t("product.origin")}
                            </span>{" "}
                            {product.origin}
                          </p>
                        )}
                        {product.roastLevel && (
                          <p>
                            <span className="font-bold text-coffee-900 dark:text-white">
                              {t("product.roastLevel")}
                            </span>{" "}
                            {product.roastLevel}
                          </p>
                        )}
                        {product.tastingNotes &&
                          product.tastingNotes.length > 0 && (
                            <p>
                              <span className="font-bold text-coffee-900 dark:text-white">
                                {t("product.notes")}
                              </span>{" "}
                              {product.tastingNotes.join(", ")}
                            </p>
                          )}
                      </div>
                    </DetailAccordion>
                  )}

                  <DetailAccordion title={t("product.shippingReturns")}>
                    <div className="flex flex-col gap-2 mt-1">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-coffee-500" />
                        <span>{t("product.shippingText")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-coffee-500" />
                        <span>{t("product.freshnessText")}</span>
                      </div>
                    </div>
                  </DetailAccordion>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Review Section (New Integration) */}
        <ReviewSection />

        {/* Recommendations */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-20 md:mt-32 mb-16 border-t border-coffee-100 dark:border-coffee-800 pt-16">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-coffee-900 dark:text-white mb-8 md:mb-10">
              {t("product.youMightLike")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-coffee-900 border-t border-coffee-100 dark:border-coffee-800 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-40 pb-safe">
        <div className="flex items-center gap-4 max-w-lg mx-auto">
          <div className="flex items-center bg-coffee-50 dark:bg-coffee-800 rounded-full p-1 border border-coffee-100 dark:border-coffee-700">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-coffee-700 text-coffee-900 dark:text-white shadow-sm active:scale-90 transition-transform"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center font-bold text-lg text-coffee-900 dark:text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-coffee-700 text-coffee-900 dark:text-white shadow-sm active:scale-90 transition-transform"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <Button
            size="lg"
            fullWidth
            onClick={handleAddToCart}
            className="shadow-lg gap-2 text-sm font-bold"
          >
            <ShoppingBag className="w-4 h-4" />
            {t("common.addToCart")} • {CURRENCY}
            {(product.price * quantity).toFixed(2)}
          </Button>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </motion.button>

            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={displayImages[mainImageIndex]}
              alt={product.name}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
