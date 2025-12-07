import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Home, Coffee, ShoppingBag, Heart, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "../../features/cart/store";
import { useCart } from "@/api";
import { useAuthStore } from "../../features/auth/store";
import { useFavoritesStore } from "../../features/favorites/store";
import { useLanguage } from "../../contexts/LanguageContext";
import { toast } from "sonner";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
  onClick?: (e: React.MouseEvent) => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, badge, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
    (to !== "/" && location.pathname.startsWith(to));

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className="flex flex-col items-center justify-center flex-1 py-2 relative group"
      aria-label={label}
    >
      <div className={`
        relative p-2 rounded-2xl transition-all duration-200
        ${isActive 
          ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" 
          : "text-coffee-500 dark:text-coffee-400 group-hover:text-coffee-700 dark:group-hover:text-coffee-200"
        }
      `}>
        <Icon 
          className="h-6 w-6" 
          strokeWidth={isActive ? 2.5 : 2} 
          aria-hidden="true" 
        />
        {badge !== undefined && badge > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 h-5 w-5 bg-yellow-500 text-coffee-900 text-[10px] flex items-center justify-center rounded-full font-bold shadow-sm"
          >
            {badge > 99 ? "99+" : badge}
          </motion.span>
        )}
      </div>
      <span className={`
        text-[10px] font-medium mt-1 transition-colors
        ${isActive 
          ? "text-yellow-600 dark:text-yellow-400" 
          : "text-coffee-500 dark:text-coffee-400"
        }
      `}>
        {label}
      </span>
    </NavLink>
  );
};

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleCart } = useCartStore();
  const { data: cartItems = [] } = useCart();
  const { isAuthenticated } = useAuthStore();
  const { items: favoriteItems } = useFavoritesStore();
  const { t } = useLanguage();
  
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const favoriteCount = favoriteItems.length;

  // Hide only on dashboard pages (bottom nav shows on auth pages now)
  if (location.pathname.startsWith("/dashboard")) {
    return null;
  }

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error(t("common.pleaseLogin"), {
        description: t("cart.loginRequired"),
      });
      navigate("/login");
      return;
    }
    toggleCart();
  };

  const handleFavoritesClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast.error(t("common.pleaseLogin"), {
        description: t("favorites.loginRequired"),
      });
      navigate("/login");
    }
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate("/login");
    }
  };

  return (
    <nav 
      className="fixed bottom-0 inset-x-0 md:hidden z-50 bg-white/95 dark:bg-coffee-950/95 backdrop-blur-lg border-t border-coffee-100 dark:border-coffee-800 shadow-lg shadow-black/5"
      data-testid="mobile-bottom-nav"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16 pb-safe max-w-lg mx-auto">
        {/* Home */}
        <NavItem 
          to="/" 
          icon={Home} 
          label={t("nav.home")} 
        />

        {/* Menu */}
        <NavItem 
          to="/menu" 
          icon={Coffee} 
          label={t("nav.menu")} 
        />

        {/* Cart - Center, prominent */}
        <button
          onClick={handleCartClick}
          className="flex flex-col items-center justify-center flex-1 py-2 relative group"
          aria-label={`${t("cart.label")}${itemCount > 0 ? `, ${itemCount} items` : ""}`}
        >
          <div className="relative -mt-4 p-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/30 group-hover:shadow-yellow-500/50 transition-all group-active:scale-95">
            <ShoppingBag 
              className="h-6 w-6 text-coffee-900" 
              strokeWidth={2.5} 
              aria-hidden="true" 
            />
            <AnimatePresence>
              {isAuthenticated && itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 h-5 w-5 bg-coffee-900 text-white text-[10px] flex items-center justify-center rounded-full font-bold"
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <span className="text-[10px] font-medium mt-1 text-coffee-600 dark:text-coffee-300">
            {t("cart.label")}
          </span>
        </button>

        {/* Favorites */}
        <NavItem 
          to="/favorites" 
          icon={Heart} 
          label={t("common.favorites")}
          badge={isAuthenticated ? favoriteCount : undefined}
          onClick={handleFavoritesClick}
        />

        {/* Profile / Login */}
        <NavItem 
          to={isAuthenticated ? "/settings" : "/login"} 
          icon={User} 
          label={isAuthenticated ? t("nav.profile") : t("nav.signIn")}
          onClick={handleProfileClick}
        />
      </div>
    </nav>
  );
};
