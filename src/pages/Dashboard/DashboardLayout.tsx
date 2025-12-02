
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store';
import { 
  Coffee, 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  LogOut, 
  Menu, 
  X, 
  Package, 
  ClipboardList,
  BarChart3,
  BrainCircuit,
  Boxes,
  Receipt,
  ChevronDown,
  PieChart,
  UserCog,
  Briefcase,
  FileText,
  MapPin,
  Store,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Role } from '@/types';
import { cn } from '../../utils/cn';
import { useLanguage } from '../../contexts/LanguageContext';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { LanguageDialog } from '../../components/common/LanguageDialog';
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
} from "../../components/ui/alert-dialog";

interface NavItemConfig {
  to?: string;
  icon: React.ElementType;
  labelKey: string;
  roles: Role[];
  end?: boolean;
  children?: NavItemConfig[];
  separatorAfter?: boolean;
}

const NAV_ITEMS: NavItemConfig[] = [
  { 
    to: '/dashboard', 
    icon: LayoutDashboard, 
    labelKey: 'dashboard.nav.overview', 
    roles: ['admin', 'superadmin', 'barista', 'data_analyst'],
    end: true 
  },
  // Operational Group
  { 
    to: '/dashboard/orders', 
    icon: ShoppingBag, 
    labelKey: 'dashboard.nav.activeOrders', 
    roles: ['barista', 'admin', 'superadmin'] 
  },
  { 
    to: '/dashboard/logistics', 
    icon: ClipboardList, 
    labelKey: 'dashboard.nav.logistics', 
    roles: ['barista', 'admin', 'superadmin'],
    separatorAfter: true 
  },
  // Financial & Inventory Group
  { 
    to: '/dashboard/transactions', 
    icon: Receipt, 
    labelKey: 'dashboard.nav.transactions', 
    roles: ['admin', 'superadmin'] 
  },
  { 
    to: '/dashboard/products', 
    icon: Package, 
    labelKey: 'dashboard.nav.products', 
    roles: ['admin', 'superadmin'] 
  },
  { 
    to: '/dashboard/inventory', 
    icon: Boxes, 
    labelKey: 'dashboard.nav.inventory', 
    roles: ['admin', 'superadmin'] 
  },
  { 
    to: '/dashboard/finance', 
    icon: FileText, 
    labelKey: 'dashboard.nav.finance', 
    roles: ['admin', 'superadmin'],
    separatorAfter: true 
  },
  // People Group
  {
    labelKey: 'dashboard.nav.userManagement',
    icon: Users,
    roles: ['admin', 'superadmin'],
    children: [
        {
            to: '/dashboard/users?view=employees',
            labelKey: 'dashboard.nav.employees',
            icon: Briefcase,
            roles: ['admin', 'superadmin']
        },
        {
            to: '/dashboard/users?view=customers',
            labelKey: 'dashboard.nav.customers',
            icon: UserCog,
            roles: ['admin', 'superadmin']
        },
        {
            to: '/dashboard/segments',
            labelKey: 'dashboard.nav.segmentation',
            icon: PieChart,
            roles: ['admin', 'superadmin']
        }
    ]
  },
  // CMS Group
  {
    labelKey: 'dashboard.nav.cms',
    icon: Store,
    roles: ['admin', 'superadmin'],
    children: [
        {
            to: '/dashboard/cms/jobs',
            labelKey: 'dashboard.nav.jobs',
            icon: Briefcase,
            roles: ['admin', 'superadmin']
        },
        {
            to: '/dashboard/cms/locations',
            labelKey: 'dashboard.nav.locations',
            icon: MapPin,
            roles: ['admin', 'superadmin']
        }
    ]
  },
  // Intelligence Group
  { 
    to: '/dashboard/analytics', 
    icon: BarChart3, 
    labelKey: 'dashboard.nav.analytics', 
    roles: ['admin', 'superadmin', 'data_analyst'] 
  },
  { 
    to: '/dashboard/bi', 
    icon: BrainCircuit, 
    labelKey: 'dashboard.nav.intelligence', 
    roles: ['superadmin', 'data_analyst'] 
  },
];

const SidebarItem: React.FC<{ 
    item: NavItemConfig, 
    userRole: Role, 
    onNavigate: () => void 
}> = ({ item, userRole, onNavigate }) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();
    
    // Check if this item (or its children) is active
    const isActive = item.to ? location.pathname === item.to : false;
    const isChildActive = item.children?.some(child => location.pathname + location.search === child.to);

    useEffect(() => {
        if (isChildActive) setIsOpen(true);
    }, [isChildActive]);

    if (!item.roles.includes(userRole)) return null;

    // Render Parent with Children (Accordion)
    if (item.children) {
        return (
            <div className={cn("mb-2", item.separatorAfter && "mb-6 pb-4 border-b border-coffee-800/30")}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 group text-left",
                        isChildActive 
                            ? 'bg-coffee-800/40 text-coffee-50 shadow-inner' 
                            : 'text-coffee-200 hover:bg-coffee-800/30 hover:text-white'
                    )}
                >
                    <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 opacity-80" />
                        <span className="font-medium tracking-wide text-sm">{t(item.labelKey as any)}</span>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 transition-transform duration-200 opacity-60", isOpen && "rotate-180")} />
                </button>
                
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden ml-4 pl-4 border-l border-coffee-700/30 mt-1 space-y-1"
                        >
                            {item.children.map((child) => (
                                <NavLink
                                    key={child.to}
                                    to={child.to!}
                                    onClick={onNavigate}
                                    className={({ isActive: isChildNavLinkActive }) => {
                                        const currentPath = location.pathname + location.search;
                                        const isMatch = currentPath === child.to;
                                        
                                        return cn(
                                            "flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-200",
                                            isMatch
                                                ? 'bg-yellow-500/10 text-yellow-400'
                                                : 'text-coffee-300 hover:text-white hover:bg-coffee-800/30'
                                        );
                                    }}
                                >
                                    <child.icon className="w-4 h-4 opacity-70" />
                                    {t(child.labelKey as any)}
                                </NavLink>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // Render Simple Link
    return (
        <div className={cn("mb-2", item.separatorAfter && "mb-6 pb-4 border-b border-coffee-800/30")}>
            <NavLink 
                to={item.to!} 
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) => cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                    isActive 
                    ? 'bg-yellow-500 text-coffee-900 font-bold shadow-md' 
                    : 'text-coffee-200 hover:bg-coffee-800/30 hover:text-white'
                )}
            >
                {isActive && (
                    <motion.div 
                        layoutId="activeSidebarBg"
                        className="absolute inset-0 bg-yellow-500 z-0"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
                <span className="relative z-10 flex items-center gap-3">
                    <item.icon className={cn("w-5 h-5 transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-110")} />
                    <span className="text-sm font-medium tracking-wide">{t(item.labelKey as any)}</span>
                </span>
            </NavLink>
        </div>
    );
};

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
  const { t, language } = useLanguage();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  const SidebarContent = () => (
    <>
      <style>{`
        .sidebar-scroll::-webkit-scrollbar {
            width: 5px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
            background: transparent;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
        }
        .sidebar-scroll:hover::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
      <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 rounded-xl text-coffee-900 shadow-lg shadow-yellow-500/20">
               <Coffee className="h-6 w-6" />
            </div>
            <div>
                <span className="font-serif font-bold text-xl tracking-tight text-white block leading-none">Coffee & Co.</span>
                <span className="text-[10px] text-coffee-400 uppercase tracking-widest font-bold">{t('dashboard.header.adminPortal')}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-coffee-800/30 p-3 rounded-2xl border border-coffee-700/30 backdrop-blur-sm mb-4">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coffee-700 to-coffee-600 flex items-center justify-center font-bold text-coffee-100 shadow-inner border border-coffee-600 text-sm">
                {user.name.charAt(0).toUpperCase()}
             </div>
             <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-coffee-400 capitalize truncate tracking-wide">{t(('common.roles.' + user.role) as any)}</p>
             </div>
          </div>
        </div>

        <div className="flex-1 px-4 overflow-y-auto sidebar-scroll">
          {NAV_ITEMS.map((item, idx) => (
             <SidebarItem 
                key={idx} 
                item={item} 
                userRole={user.role} 
                onNavigate={() => setIsMobileMenuOpen(false)} 
             />
          ))}
        </div>

        <div className="p-4 border-t border-coffee-800/30 bg-[#1C1917]">
           <button 
             onClick={() => setIsLanguageDialogOpen(true)}
             className="flex items-center gap-3 px-4 py-3 text-coffee-400 hover:bg-coffee-800/30 hover:text-white w-full rounded-xl transition-all duration-200 group mb-2"
           >
              <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-medium">{t('settings.language')}</span>
           </button>
           <AlertDialog>
             <AlertDialogTrigger asChild>
               <button 
                 className="flex items-center gap-3 px-4 py-3 text-coffee-400 hover:bg-red-500/10 hover:text-red-400 w-full rounded-xl transition-all duration-200 group"
               >
                  <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm font-medium">{t('dashboard.header.signOut')}</span>
               </button>
             </AlertDialogTrigger>
             <AlertDialogContent>
               <AlertDialogHeader>
                 <AlertDialogTitle>{t('dashboard.header.signOutDialog.title')}</AlertDialogTitle>
                 <AlertDialogDescription>
                   {t('dashboard.header.signOutDialog.description')}
                 </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                 <AlertDialogCancel>{t('dashboard.header.signOutDialog.cancel')}</AlertDialogCancel>
                 <AlertDialogAction onClick={handleLogout}>
                   {t('dashboard.header.signOutDialog.confirm')}
                 </AlertDialogAction>
               </AlertDialogFooter>
             </AlertDialogContent>
           </AlertDialog>
        </div>
        <LanguageDialog open={isLanguageDialogOpen} onOpenChange={setIsLanguageDialogOpen} />
    </>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-coffee-950 flex flex-col md:flex-row font-sans transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-[#1C1917] hidden md:flex flex-col sticky top-0 h-screen shadow-2xl z-20 border-r border-coffee-900">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="bg-[#1C1917] text-white p-4 flex items-center justify-between md:hidden sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2">
            <div className="bg-yellow-500 p-1.5 rounded-lg text-coffee-900">
               <Coffee className="h-4 w-4" />
            </div>
            <span className="font-serif font-bold text-lg tracking-tight">{t('dashboard.header.adminPortal')}</span>
        </div>
        <div className="flex items-center gap-4">
            <button 
                onClick={() => navigate('/')} 
                className="p-2 text-coffee-400 hover:text-white"
                aria-label={t('dashboard.header.viewShop')}
            >
                <Store className="w-5 h-5" />
            </button>
            <ThemeToggle />
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-coffee-400 hover:text-white">
                <Menu className="w-6 h-6" />
            </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                />
                <motion.aside
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    className="fixed inset-y-0 left-0 z-50 w-80 bg-[#1C1917] flex flex-col md:hidden shadow-2xl"
                >
                    <div className="absolute top-4 right-4 z-50">
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-coffee-400 hover:text-white bg-coffee-800/50 rounded-lg">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <SidebarContent />
                </motion.aside>
            </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full min-h-[calc(100vh-64px)] md:min-h-screen relative">
        {/* Top Navbar */}
        <header className="bg-white/80 dark:bg-coffee-900/80 backdrop-blur-md border-b border-gray-200 dark:border-coffee-800 h-20 hidden md:flex items-center justify-between px-8 sticky top-0 z-10 transition-all">
            <h2 className="font-bold text-coffee-900 dark:text-coffee-100 capitalize text-lg flex items-center gap-2">
                <span className="p-2 bg-coffee-50 dark:bg-coffee-800 rounded-lg text-coffee-600 dark:text-coffee-300">
                    <LayoutDashboard className="w-5 h-5" />
                </span>
                {t(('common.roles.' + user.role) as any)} Dashboard
            </h2>
            <div className="flex gap-4 items-center">
                <div className="text-right hidden lg:block mr-2">
                    <p className="text-xs font-bold text-coffee-900 dark:text-coffee-200">{new Date().toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    <p className="text-[10px] text-coffee-500 dark:text-coffee-400 uppercase tracking-wider">{t('dashboard.header.systemOperational')}</p>
                </div>
                
                <ThemeToggle />

                <button 
                    onClick={() => navigate('/')} 
                    className="px-5 py-2.5 text-sm font-medium text-coffee-700 dark:text-coffee-200 bg-white dark:bg-coffee-800 border border-gray-200 dark:border-coffee-700 hover:bg-gray-50 dark:hover:bg-coffee-700 hover:border-gray-300 rounded-full transition-all shadow-sm active:scale-95"
                >
                    {t('dashboard.header.viewShop')}
                </button>
            </div>
        </header>
        
        <div className="p-4 md:p-10 max-w-[1600px] mx-auto">
            <Outlet />
        </div>
      </main>
    </div>
  );
};
