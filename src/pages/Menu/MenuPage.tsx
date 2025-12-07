import React, { useState, useEffect, useRef, useId } from "react";
import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/common/SEO";
import { fetchProducts } from "../../services/api";
import { ProductCard } from "../../features/products/ProductCard";
import { ProductCardSkeleton } from "../../features/products/ProductCardSkeleton";
import { EmptyProducts, NoFilterMatch } from "@/components/common/EmptyState";
import {
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  X,
  Search,
  Check,
  Coffee,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/common/Button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/Breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/Pagination";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useLanguage } from "../../contexts/LanguageContext";

// --- Constants ---
const ITEMS_PER_PAGE = 20;

// --- Filter Components ---

interface FilterSectionProps {
  title: string;
  isOpen?: boolean;
  children: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  isOpen = true,
  children,
}) => {
  const [open, setOpen] = useState(isOpen);
  const contentId = useId();
  const triggerId = useId();

  return (
    <div className="border-b border-coffee-100 dark:border-coffee-800 py-4">
      <h3 className="m-0 font-medium">
        <button
          id={triggerId}
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between text-base font-medium text-coffee-900 dark:text-white hover:text-coffee-600 dark:hover:text-coffee-300 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee-600 focus-visible:ring-offset-2"
          aria-expanded={open}
          aria-controls={contentId}
        >
          <span>{title}</span>
          {open ? (
            <ChevronUp className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </h3>
      <AnimatePresence>
        {open && (
          <motion.div
            id={contentId}
            role="region"
            aria-labelledby={triggerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-2 space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface CheckboxFilterProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({
  label,
  checked,
  onChange,
  id,
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div
      className="flex items-center space-x-3 group cursor-pointer"
      onClick={() => onChange(!checked)}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChange(!checked);
        }
      }}
    >
      <div
        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${
          checked
            ? "bg-coffee-900 border-coffee-900 dark:bg-coffee-100 dark:border-coffee-100"
            : "border-coffee-300 dark:border-coffee-600 group-hover:border-coffee-500"
        }`}
        aria-hidden="true"
      >
        {checked && (
          <Check className="w-3.5 h-3.5 text-white dark:text-coffee-900" />
        )}
      </div>
      <Label
        htmlFor={inputId}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-coffee-600 dark:text-coffee-300 group-hover:text-coffee-900 dark:group-hover:text-white cursor-pointer transition-colors"
      >
        {label}
      </Label>
    </div>
  );
};

// --- Main Page Component ---

export const MenuPage: React.FC = () => {
  const { t } = useLanguage();
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const topRef = useRef<HTMLDivElement>(null);

  // State
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters State
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string[]>([]);

  // Filter Logic
  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const togglePrice = (range: string) => {
    setPriceRange((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  // Reset page when filters or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, priceRange, sortBy, searchQuery]);

  // Derived Products (Filtered & Sorted)
  const filteredProducts = React.useMemo(() => {
    if (!products) return [];

    let result = [...products];

    // Filter by Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Filter by Category
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // Filter by Price (Mock Logic)
    if (priceRange.length > 0) {
      result = result.filter((p) => {
        if (priceRange.includes("under-5") && p.price < 5) return true;
        if (priceRange.includes("5-10") && p.price >= 5 && p.price <= 10)
          return true;
        return false;
      });
    }

    // Sort
    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    if (sortBy === "newest") result.reverse(); // Mock newest

    return result;
  }, [products, selectedCategories, priceRange, sortBy, searchQuery]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentPaginatedProducts = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Smooth scroll to top of grid
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (isMobileFiltersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileFiltersOpen]);

  return (
    <div
      className="min-h-screen bg-cream-50 dark:bg-coffee-950 pt-6 pb-12 transition-colors duration-300"
      ref={topRef}
    >
      <SEO
        title="Our Menu"
        description="Explore our wide selection of premium coffees, teas, and pastries. From single-origin espressos to vegan treats, find your perfect flavor match."
      />
      <div className="container mx-auto px-4 md:px-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink to="/">{t("nav.home")}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t("nav.menu")}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header - Increased z-index to 40 to ensure dropdown sits above cards */}
        {/* Adjusted top offset to sit below mobile header (60px height + 16px margin) */}
        {/* Mobile Header & Controls (Sticky) */}
        <div className="md:hidden sticky top-[76px] z-30 bg-white/95 dark:bg-coffee-950/95 backdrop-blur-md -mx-4 px-4 py-3 mb-6 shadow-sm transition-all">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-serif font-bold text-coffee-900 dark:text-white">
              {t("nav.menu")}{" "}
              <span className="text-sm text-coffee-500 font-sans font-normal">
                ({filteredProducts.length})
              </span>
            </h1>
          </div>

          <div className="space-y-3">
            {/* Mobile Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-coffee-400 pointer-events-none"
                aria-hidden="true"
              />
              <Input
                type="text"
                placeholder={t("common.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-full bg-coffee-50 dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-white placeholder:text-coffee-400"
                aria-label="Search products"
              />
            </div>

            <div className="flex gap-2">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 h-10 bg-white dark:bg-coffee-800 border border-coffee-200 dark:border-coffee-700 rounded-full text-sm font-medium text-coffee-900 dark:text-white active:bg-coffee-50 dark:active:bg-coffee-700 transition-colors"
                aria-label="Open filters"
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                {t("common.filters")}
              </button>

              {/* Mobile Sort */}
              <div className="flex-1">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full h-10 rounded-full bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-sm">
                    <div className="flex items-center gap-2 justify-center w-full">
                      <span className="text-coffee-500 dark:text-coffee-400">
                        {t("common.sort")}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">
                      {t("menu.sort.featured")}
                    </SelectItem>
                    <SelectItem value="newest">
                      {t("menu.sort.newest")}
                    </SelectItem>
                    <SelectItem value="price-low">
                      {t("menu.sort.priceLow")}
                    </SelectItem>
                    <SelectItem value="price-high">
                      {t("menu.sort.priceHigh")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <header className="hidden md:flex flex-col gap-6 mb-10">
          <div className="flex items-end justify-between gap-4 border-b border-coffee-200 dark:border-coffee-800 pb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-coffee-900 dark:text-white tracking-tight mb-2">
                {t("nav.menu")}
              </h1>
              <p className="text-coffee-500 dark:text-coffee-400">
                Showing {isLoading ? "..." : filteredProducts.length} results
              </p>
            </div>

            <div className="flex items-center gap-4 justify-end">
              <div className="relative group w-72">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-coffee-400 group-focus-within:text-coffee-600 transition-colors pointer-events-none"
                  aria-hidden="true"
                />
                <Input
                  type="text"
                  placeholder={t("common.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 h-12 rounded-full bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-white placeholder:text-coffee-400 dark:placeholder:text-coffee-500 shadow-sm focus-visible:ring-coffee-400 focus-visible:border-coffee-400 transition-all"
                  aria-label="Search products"
                />
              </div>

              <div className="w-[200px]">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full h-12 rounded-full bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-coffee-500 dark:text-coffee-400 font-medium">
                        {t("common.sort")}:
                      </span>
                      <SelectValue placeholder={t("common.sort")} />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">
                      {t("menu.sort.featured")}
                    </SelectItem>
                    <SelectItem value="newest">
                      {t("menu.sort.newest")}
                    </SelectItem>
                    <SelectItem value="price-low">
                      {t("menu.sort.priceLow")}
                    </SelectItem>
                    <SelectItem value="price-high">
                      {t("menu.sort.priceHigh")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Desktop Sidebar Filters */}
          <aside
            className="hidden md:block w-64 shrink-0 space-y-6 sticky top-[160px] self-start max-h-[calc(100vh-160px)] overflow-y-auto pr-2 scrollbar-thin"
            aria-label="Product filters"
          >
            <div className="pb-4 border-b border-coffee-200 dark:border-coffee-800">
              <h3 className="font-serif font-bold text-xl text-coffee-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
                {t("common.filters")}
              </h3>
            </div>

            <div className="space-y-6">
              <FilterSection title={t("menu.filters.category")} isOpen>
                {["coffee", "pastry", "merch"].map((cat) => (
                  <CheckboxFilter
                    key={cat}
                    label={t(`menu.categories.${cat}` as any)}
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                  />
                ))}
              </FilterSection>

              <FilterSection title={t("menu.filters.price")}>
                <CheckboxFilter
                  label={t("menu.filters.under5")}
                  checked={priceRange.includes("under-5")}
                  onChange={() => togglePrice("under-5")}
                />
                <CheckboxFilter
                  label={t("menu.filters.5to10")}
                  checked={priceRange.includes("5-10")}
                  onChange={() => togglePrice("5-10")}
                />
              </FilterSection>

              <FilterSection title={t("menu.filters.roast")} isOpen={false}>
                {/* Mock Filters for visuals */}
                <CheckboxFilter
                  label={t("menu.filters.light")}
                  checked={false}
                  onChange={() => {}}
                />
                <CheckboxFilter
                  label={t("menu.filters.medium")}
                  checked={false}
                  onChange={() => {}}
                />
                <CheckboxFilter
                  label={t("menu.filters.dark")}
                  checked={false}
                  onChange={() => {}}
                />
              </FilterSection>

              <FilterSection title={t("menu.filters.dietary")} isOpen={false}>
                <CheckboxFilter
                  label={t("menu.filters.vegan")}
                  checked={false}
                  onChange={() => {}}
                />
                <CheckboxFilter
                  label={t("menu.filters.glutenFree")}
                  checked={false}
                  onChange={() => {}}
                />
                <CheckboxFilter
                  label={t("menu.filters.dairyFree")}
                  checked={false}
                  onChange={() => {}}
                />
              </FilterSection>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1 flex flex-col relative z-0">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-12">
                {Array.from({ length: 9 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              // Determine if filters are active
              selectedCategories.length > 0 || priceRange.length > 0 || searchQuery ? (
                <NoFilterMatch
                  onClearFilters={() => {
                    setSelectedCategories([]);
                    setPriceRange([]);
                    setSearchQuery("");
                  }}
                />
              ) : (
                <EmptyProducts size="lg" />
              )
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-12">
                  {currentPaginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-auto pt-8 border-t border-coffee-100 dark:border-coffee-800">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              handlePageChange(Math.max(1, currentPage - 1))
                            }
                            disabled={currentPage === 1}
                          />
                        </PaginationItem>

                        {Array.from({ length: totalPages }).map((_, idx) => {
                          const pageNum = idx + 1;
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                isActive={pageNum === currentPage}
                                onClick={() => handlePageChange(pageNum)}
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              handlePageChange(
                                Math.min(totalPages, currentPage + 1)
                              )
                            }
                            disabled={currentPage === totalPages}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black z-50 md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full sm:w-[350px] bg-white dark:bg-coffee-900 shadow-2xl md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-coffee-100 dark:border-coffee-800">
                <h2 className="text-xl font-serif font-bold text-coffee-900 dark:text-white">
                  {t("common.filters")}
                </h2>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-2 hover:bg-coffee-50 dark:hover:bg-coffee-800 rounded-full text-coffee-600 dark:text-coffee-300"
                  aria-label="Close filters"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                <FilterSection title={t("menu.filters.category")} isOpen>
                  {["coffee", "pastry", "merch"].map((cat) => (
                    <CheckboxFilter
                      key={cat}
                      label={t(`menu.categories.${cat}` as any)}
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                  ))}
                </FilterSection>

                <FilterSection title={t("menu.filters.price")}>
                  <CheckboxFilter
                    label={t("menu.filters.under5")}
                    checked={priceRange.includes("under-5")}
                    onChange={() => togglePrice("under-5")}
                  />
                  <CheckboxFilter
                    label={t("menu.filters.5to10")}
                    checked={priceRange.includes("5-10")}
                    onChange={() => togglePrice("5-10")}
                  />
                </FilterSection>

                <FilterSection title={t("menu.filters.roast")}>
                  <CheckboxFilter
                    label={t("menu.filters.light")}
                    checked={false}
                    onChange={() => {}}
                  />
                  <CheckboxFilter
                    label={t("menu.filters.medium")}
                    checked={false}
                    onChange={() => {}}
                  />
                  <CheckboxFilter
                    label={t("menu.filters.dark")}
                    checked={false}
                    onChange={() => {}}
                  />
                </FilterSection>
              </div>

              <div className="p-6 border-t border-coffee-100 dark:border-coffee-800 bg-white dark:bg-coffee-900">
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-full py-4 bg-coffee-900 text-white rounded-full font-bold shadow-lg active:scale-95 transition-transform"
                >
                  {t("menu.showResults")} ({filteredProducts.length})
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
