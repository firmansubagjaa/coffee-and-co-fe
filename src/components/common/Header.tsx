
import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, Coffee, BookOpen, MapPin, Users, LogOut, Heart, LayoutDashboard, History, Bookmark, Settings, Globe, ChevronDown } from 'lucide-react';
import { useCartStore } from '../../features/cart/store';
import { useAuthStore } from '../../features/auth/store';
import { useFavoritesStore } from '../../features/favorites/store';
import { useLanguage } from '../../contexts/LanguageContext';
import { APP_NAME, NAV_LINKS } from '../../utils/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { TRANSITIONS } from '../../utils/animations';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContentWrapper,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuButton,
  NavigationItemDirect,
} from '../ui/NavigationMenu';
import { Button } from './Button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/Tooltip';
import { toast } from 'sonner';
import { SearchDialog } from './SearchDialog';
import { ThemeToggle } from './ThemeToggle';
import { LanguageDialog } from './LanguageDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [activeMobileSection, setActiveMobileSection] = useState<string | null>(null);
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
  const { items, toggleCart } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { t } = useLanguage();
  const { items: favoriteItems } = useFavoritesStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const favoriteCount = favoriteItems.length;
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success("Logged out successfully");
  };

  const handleCartClick = () => {
    if (!isAuthenticated) {
        toast.error("Please log in", {
            description: "You need to be logged in to view your cart."
        });
        navigate('/login');
        return;
    }
    toggleCart();
  };

  const handleFavoritesClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
        e.preventDefault();
        toast.error("Please log in", {
            description: "You need to be logged in to view favorites."
        });
        navigate('/login');
    }
  };

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hide header on auth pages, forgot password flow, AND dashboard pages
  if (
    ['/login', '/register', '/forgot-password', '/verify-otp', '/reset-password'].includes(location.pathname) || 
    location.pathname.startsWith('/dashboard')
  ) {
    return null;
  }

  return (
    <>
      <header className="sticky top-4 z-[50] w-full px-4 md:px-6 mt-2 mb-4">
        <motion.div 
          layout
          className={`
            mx-auto max-w-7xl
            bg-white/80 dark:bg-black/90 backdrop-blur-md
            border border-coffee-200/50 dark:border-white/10 shadow-sm dark:shadow-black/40
            md:overflow-visible overflow-hidden
            ${isMobileMenuOpen ? 'rounded-[2rem]' : 'rounded-full'}
          `}
          transition={TRANSITIONS.softSpring}
        >
          <div className="px-4 md:px-6 h-[72px] flex items-center justify-between relative">
            
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-3 group mr-8 relative z-20">
                <motion.div 
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-coffee-600 dark:text-coffee-400"
                >
                    <Coffee className="h-6 w-6" strokeWidth={2.5} />
                </motion.div>
                <span className="text-xl md:text-2xl font-serif font-bold text-coffee-900 dark:text-white tracking-tight hidden sm:block">
                    {APP_NAME}
                </span>
            </NavLink>

            {/* Desktop Nav */}
            <div className="hidden md:flex justify-center flex-1 relative z-30">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationItemDirect to="/" end>{t('nav.home')}</NavigationItemDirect>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationItemDirect to="/menu">{t('nav.menu')}</NavigationItemDirect>
                  </NavigationMenuItem>

                  <NavigationMenuItem value="about">
                    <NavigationMenuTrigger active={location.pathname.startsWith('/about')}>{t('nav.about')}</NavigationMenuTrigger>
                    <NavigationMenuContentWrapper value="about">
                      <NavigationMenuContent className="w-[320px] p-2">
                        <ul className="grid gap-1">
                            <li>
                              <NavigationMenuLink to="/about" end>
                                <div className="flex items-start gap-3">
                                  <BookOpen className="h-5 w-5 text-coffee-500 mt-0.5" />
                                  <div>
                                    <span className="block text-sm font-bold text-coffee-900 dark:text-coffee-100">{t('nav.ourStory')}</span>
                                    <span className="block text-xs text-coffee-500 dark:text-coffee-400 mt-0.5">{t('nav.ourStoryDesc')}</span>
                                  </div>
                                </div>
                              </NavigationMenuLink>
                            </li>
                            <li>
                              <NavigationMenuLink to="/about/careers">
                                <div className="flex items-start gap-3">
                                  <Users className="h-5 w-5 text-coffee-500 mt-0.5" />
                                  <div>
                                    <span className="block text-sm font-bold text-coffee-900 dark:text-coffee-100">{t('nav.careers')}</span>
                                    <span className="block text-xs text-coffee-500 dark:text-coffee-400 mt-0.5">{t('nav.careersDesc')}</span>
                                  </div>
                                </div>
                              </NavigationMenuLink>
                            </li>
                            <li>
                              <NavigationMenuLink to="/about/locations">
                                <div className="flex items-start gap-3">
                                  <MapPin className="h-5 w-5 text-coffee-500 mt-0.5" />
                                  <div>
                                    <span className="block text-sm font-bold text-coffee-900 dark:text-coffee-100">{t('nav.locations')}</span>
                                    <span className="block text-xs text-coffee-500 dark:text-coffee-400 mt-0.5">{t('nav.locationsDesc')}</span>
                                  </div>
                                </div>
                              </NavigationMenuLink>
                            </li>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuContentWrapper>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationItemDirect to={isAuthenticated ? "/rewards" : "/login"}>{t('nav.rewards')}</NavigationItemDirect>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4 relative z-20">
              
              <SearchDialog />

              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink
                    to="/favorites"
                    onClick={handleFavoritesClick}
                    className={({ isActive }) => `relative p-2 rounded-full transition-all group hidden sm:block ${isActive ? 'text-red-500 bg-red-50 dark:bg-red-500/10 dark:text-red-400' : 'text-coffee-700 dark:text-coffee-200 hover:bg-coffee-100 dark:hover:bg-white/10'}`}
                    aria-label="Favorites"
                  >
                    <Heart className={`h-5 w-5 transition-transform group-hover:scale-110`} strokeWidth={2} />
                    {isAuthenticated && favoriteCount > 0 && (
                      <motion.span 
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white dark:border-coffee-900"
                      />
                    )}
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('common.favorites')}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={handleCartClick}
                    className="relative p-2 text-coffee-700 dark:text-coffee-200 hover:bg-coffee-100 dark:hover:bg-white/10 rounded-full transition-all group"
                    aria-label="Open cart"
                  >
                    <ShoppingBag className="h-5 w-5 transition-transform group-hover:rotate-12" strokeWidth={2} />
                    <AnimatePresence>
                      {isAuthenticated && itemCount > 0 && (
                        <motion.span 
                          initial={{ scale: 0 }} 
                          animate={{ scale: 1 }} 
                          exit={{ scale: 0 }}
                          className="absolute top-0.5 right-0.5 h-4 w-4 bg-yellow-500 text-coffee-900 text-[10px] flex items-center justify-center rounded-full font-bold shadow-sm"
                        >
                          {itemCount}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('cart.label')}</p>
                </TooltipContent>
              </Tooltip>

              {/* Auth Button (Desktop) */}
              <div className="hidden md:block ml-2">
                {isAuthenticated && user ? (
                  <NavigationMenu>
                      <NavigationMenuList>
                        <NavigationMenuItem value="profile">
                          <NavigationMenuTrigger className="!px-1 !bg-transparent hover:!bg-coffee-100 dark:hover:!bg-white/10 text-coffee-900 dark:text-white">
                            <div className="flex items-center gap-2 pl-1 pr-3 py-1">
                                <div 
                                  className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm ring-2 ring-white/20 dark:ring-white/10"
                                  style={{ backgroundColor: `#${user.avatarColor || '795548'}` }}
                                >
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium">{user.name}</span>
                            </div>
                          </NavigationMenuTrigger>
                          <NavigationMenuContentWrapper value="profile">
                            <NavigationMenuContent className="w-[220px] -right-2 left-auto p-2">
                                <ul className="grid gap-1">
                                  {['admin', 'superadmin', 'barista'].includes(user.role) && (
                                    <li>
                                        <NavigationMenuLink to="/dashboard">
                                          <div className="flex items-center gap-2">
                                              <LayoutDashboard className="h-4 w-4 text-coffee-500" />
                                              {t('common.dashboard')}
                                          </div>
                                        </NavigationMenuLink>
                                    </li>
                                  )}
                                  <li>
                                    <NavigationMenuLink to="/history">
                                      <div className="flex items-center gap-2">
                                          <History className="h-4 w-4 text-coffee-500" />
                                          {t('nav.orderHistory')}
                                      </div>
                                    </NavigationMenuLink>
                                  </li>
                                  <li>
                                    <NavigationMenuLink to="/wishlist">
                                      <div className="flex items-center gap-2">
                                          <Bookmark className="h-4 w-4 text-coffee-500" />
                                          {t('nav.wishlist')}
                                      </div>
                                    </NavigationMenuLink>
                                  </li>
                                  <li>
                                    <NavigationMenuLink to="/settings">
                                      <div className="flex items-center gap-2">
                                          <Settings className="h-4 w-4 text-coffee-500" />
                                          {t('nav.settings')}
                                      </div>
                                    </NavigationMenuLink>
                                  </li>
                                  {/* Language Option */}
                                  <li>
                                    <button 
                                      onClick={() => setIsLanguageDialogOpen(true)}
                                      className="relative block w-full select-none space-y-1 rounded-3xl p-3 leading-none no-underline outline-none transition-colors text-left font-medium text-coffee-900 dark:text-coffee-100 hover:bg-coffee-50 dark:hover:bg-coffee-800"
                                    >
                                      <div className="flex items-center gap-2">
                                          <Globe className="h-4 w-4 text-coffee-500" />
                                          {t('nav.language')}
                                      </div>
                                    </button>
                                  </li>
                                  <li>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                          <button className="relative block w-full select-none space-y-1 rounded-3xl p-3 leading-none no-underline outline-none transition-colors text-left font-medium text-red-600 hover:bg-red-50 hover:text-red-700">
                                              <div className="flex items-center gap-2">
                                                  <LogOut className="h-4 w-4" />
                                                  {t('nav.signOut')}
                                              </div>
                                          </button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                          <AlertDialogHeader>
                                              <AlertDialogTitle>{t('nav.logoutConfirmTitle')}</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                  {t('nav.logoutConfirmDesc')}
                                              </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                              <AlertDialogCancel>{t('nav.cancel')}</AlertDialogCancel>
                                              <AlertDialogAction onClick={handleLogout}>{t('nav.confirmLogout')}</AlertDialogAction>
                                          </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </li>
                                </ul>
                            </NavigationMenuContent>
                          </NavigationMenuContentWrapper>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                  </NavigationMenu>
                ) : (
                  <div className="flex items-center gap-3">
                    {/* Language Trigger for Non-Auth */}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setIsLanguageDialogOpen(true)}
                      className="rounded-full w-9 h-9 text-coffee-700 dark:text-coffee-200 hover:bg-coffee-100 dark:hover:bg-white/10"
                    >
                      <Globe className="h-5 w-5" strokeWidth={2} />
                    </Button>

                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => navigate('/login')}
                      className="rounded-full !px-6 !h-10 font-bold tracking-wide"
                    >
                      {t('nav.signIn').toUpperCase()}
                    </Button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden p-3.5 text-coffee-800 dark:text-coffee-200 hover:bg-white/50 dark:hover:bg-coffee-800 rounded-full transition-all"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode='wait'>
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
          
          {/* Mobile Nav Content */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="md:hidden overflow-hidden"
              >
                <nav className="flex flex-col p-5 pt-0 gap-2 pb-8">
                  {/* Simplified Mobile Links */}
                  <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium py-3 px-6 rounded-[2rem] text-coffee-600 dark:text-coffee-300 hover:bg-white/40 dark:hover:bg-coffee-800">{t('nav.home')}</NavLink>
                  <NavLink to="/menu" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium py-3 px-6 rounded-[2rem] text-coffee-600 dark:text-coffee-300 hover:bg-white/40 dark:hover:bg-coffee-800">{t('nav.menu')}</NavLink>
                  
                  {/* Mobile About Accordion */}
                  <div className="py-2 px-6">
                      <button 
                        onClick={() => setActiveMobileSection(activeMobileSection === 'about' ? null : 'about')}
                        className="flex items-center justify-between w-full text-lg font-medium text-coffee-900 dark:text-coffee-100 mb-2"
                      >
                        {t('nav.about')}
                        <ChevronDown className={`h-5 w-5 transition-transform ${activeMobileSection === 'about' ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {activeMobileSection === 'about' && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 border-l-2 border-coffee-100 dark:border-coffee-800 space-y-2 pb-2">
                                <NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 text-coffee-600 dark:text-coffee-400">{t('nav.ourStory')}</NavLink>
                                <NavLink to="/about/careers" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 text-coffee-600 dark:text-coffee-400">{t('nav.careers')}</NavLink>
                                <NavLink to="/about/locations" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 text-coffee-600 dark:text-coffee-400">{t('nav.locations')}</NavLink>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                  </div>

                  <NavLink to="/rewards" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium py-3 px-6 rounded-[2rem] text-coffee-600 dark:text-coffee-300 hover:bg-white/40 dark:hover:bg-coffee-800">{t('nav.rewards')}</NavLink>
                  
                  {/* Mobile Language Trigger */}
                  <button 
                    onClick={() => { setIsLanguageDialogOpen(true); setIsMobileMenuOpen(false); }}
                    className="text-lg font-medium py-3 px-6 rounded-[2rem] text-coffee-600 dark:text-coffee-300 hover:bg-white/40 dark:hover:bg-coffee-800 text-left"
                  >
                    {t('nav.language')}
                  </button>

                  {!isAuthenticated && (
                      <NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium py-3 px-6 rounded-[2rem] text-coffee-600 dark:text-coffee-300 hover:bg-white/40 dark:hover:bg-coffee-800">{t('nav.signIn')}</NavLink>
                  )}

                  {isAuthenticated && (
                      <div className="py-2 px-6 mt-2">
                          <button 
                            onClick={() => setActiveMobileSection(activeMobileSection === 'profile' ? null : 'profile')}
                            className="flex items-center justify-between w-full text-lg font-medium text-coffee-900 dark:text-coffee-100 mb-2"
                          >
                            {t('nav.profile')}
                            <ChevronDown className={`h-5 w-5 transition-transform ${activeMobileSection === 'profile' ? 'rotate-180' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {activeMobileSection === 'profile' && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-4 border-l-2 border-coffee-100 dark:border-coffee-800 space-y-2 pb-2">
                                    {['admin', 'superadmin', 'barista'].includes(user.role) && (
                                        <NavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 font-bold text-coffee-700 dark:text-coffee-300">
                                            {t('common.dashboard')}
                                        </NavLink>
                                    )}
                                    <NavLink to="/history" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 text-coffee-600 dark:text-coffee-400">{t('nav.orderHistory')}</NavLink>
                                    <NavLink to="/favorites" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 text-coffee-600 dark:text-coffee-400">{t('common.favorites')}</NavLink>
                                    <NavLink to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 text-coffee-600 dark:text-coffee-400">{t('nav.wishlist')}</NavLink>
                                    <NavLink to="/settings" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 text-coffee-600 dark:text-coffee-400">{t('nav.settings')}</NavLink>
                                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="block py-1 text-red-500">{t('nav.signOut')}</button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                      </div>
                  )}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <LanguageDialog open={isLanguageDialogOpen} onOpenChange={setIsLanguageDialogOpen} />
      </header>
    </>
  );
};