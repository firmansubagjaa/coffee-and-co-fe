import React, { useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { TRANSITIONS } from '../../utils/animations';

// Context
const NavigationMenuContext = createContext<{
  activeValue: string | null;
  setActiveValue: (value: string | null) => void;
}>({
  activeValue: null,
  setActiveValue: () => {},
});

const NavigationMenuItemContext = createContext<{ value?: string }>({});

// Root
export const NavigationMenu: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => {
  const [activeValue, setActiveValue] = useState<string | null>(null);

  const contextValue = React.useMemo(() => ({ activeValue, setActiveValue }), [activeValue]);

  return (
    <NavigationMenuContext.Provider value={contextValue}>
      <nav 
        className={`relative z-10 flex max-w-max flex-1 items-center justify-center ${className}`}
        onMouseLeave={() => setActiveValue(null)} 
      >
        {children}
      </nav>
    </NavigationMenuContext.Provider>
  );
};

// List
export const NavigationMenuList: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={`flex flex-1 list-none items-center justify-center space-x-1 ${className}`}>
      {children}
    </div>
  );
};

// Item
export const NavigationMenuItem: React.FC<{ children: React.ReactNode; value?: string }> = ({ 
  children,
  value
}) => {
  const { setActiveValue } = useContext(NavigationMenuContext);
  
  const contextValue = React.useMemo(() => ({ value }), [value]);

  return (
    <NavigationMenuItemContext.Provider value={contextValue}>
      <div 
        className="relative flex items-center h-full"
        onMouseEnter={() => setActiveValue(value || null)} 
      >
        {children}
      </div>
    </NavigationMenuItemContext.Provider>
  );
};

// Trigger
export const NavigationMenuTrigger: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  active?: boolean;
}> = ({ 
  children, 
  className = "",
  active = false
}) => {
  const { activeValue } = useContext(NavigationMenuContext);
  const { value } = useContext(NavigationMenuItemContext);
  const isOpen = value && activeValue === value;

  return (
    <button
      className={`group/trigger isolate inline-flex h-10 w-max items-center justify-center rounded-full bg-transparent px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 relative z-10 ${active ? 'text-coffee-900 dark:text-coffee-100' : 'text-coffee-700 dark:text-coffee-300 hover:text-coffee-900 dark:hover:text-coffee-100'} ${className}`}
      aria-expanded={isOpen}
    >
      <span className="relative z-10 flex items-center gap-1">
        {children}
        <ChevronDown
            className={`h-3 w-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
        />
      </span>
      
      {/* Active Route Indicator (Pill) */}
      {active && (
         <motion.div
            layoutId="nav-pill"
            className="absolute inset-0 bg-coffee-100 dark:bg-coffee-800 rounded-full -z-10"
            transition={TRANSITIONS.softSpring}
        />
      )}

      {/* Hover/Open Background (Only if not active) */}
      {!active && (
         <div 
            className={`absolute inset-0 rounded-full -z-20 transition-colors duration-200 ${isOpen ? 'bg-coffee-50 dark:bg-coffee-800' : 'bg-transparent group-hover/trigger:bg-coffee-50 dark:group-hover/trigger:bg-coffee-800'}`} 
         />
      )}
    </button>
  );
};

// Content Wrapper & Body
export const NavigationMenuContentWrapper: React.FC<{ 
  value: string; 
  children: React.ReactNode 
}> = ({ value, children }) => {
  const { activeValue } = useContext(NavigationMenuContext);
  
  return (
    <AnimatePresence>
      {activeValue === value && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-[60]">
           {/* Invisible bridge to prevent mouse leaving when moving from trigger to content */}
           <div className="absolute -top-2 left-0 right-0 h-2 bg-transparent" />
           {children}
        </div>
      )}
    </AnimatePresence>
  );
};

export const NavigationMenuContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -5, scale: 0.98 }}
      transition={TRANSITIONS.spring}
      className={`relative w-auto min-w-[200px] overflow-hidden rounded-[2rem] border border-coffee-100 dark:border-coffee-700 bg-white/95 dark:bg-coffee-900/95 backdrop-blur-sm p-2 text-coffee-900 dark:text-coffee-100 shadow-xl shadow-coffee-900/10 dark:shadow-black/50 ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Link Component
export const NavigationMenuLink: React.FC<{ 
  to: string; 
  children: React.ReactNode; 
  className?: string;
  end?: boolean;
}> = ({ to, children, className = "", end }) => {
  const { setActiveValue } = useContext(NavigationMenuContext);

  return (
    <NavLink
      to={to}
      end={end}
      onClick={() => setActiveValue(null)}
      className={({ isActive }) => `
        relative block w-full select-none space-y-1 rounded-3xl p-3 leading-none no-underline outline-none transition-colors text-left
        ${isActive ? 'bg-coffee-50 dark:bg-coffee-800 text-coffee-900 dark:text-coffee-100 font-bold' : 'text-coffee-600 dark:text-coffee-300 hover:bg-coffee-50 dark:hover:bg-coffee-800 hover:text-coffee-900 dark:hover:text-coffee-100 font-medium'}
        ${className}
      `}
    >
      {children}
    </NavLink>
  );
};

// Button Component
export const NavigationMenuButton: React.FC<{ 
  onClick?: () => void;
  children: React.ReactNode; 
  className?: string;
}> = ({ onClick, children, className = "" }) => {
    const { setActiveValue } = useContext(NavigationMenuContext);
    
    const handleClick = (e: React.MouseEvent) => {
        setActiveValue(null);
        onClick?.();
    }

    return (
        <button
            onClick={handleClick}
            className={`
                relative block w-full select-none space-y-1 rounded-3xl p-3 leading-none no-underline outline-none transition-colors text-left font-medium
                text-coffee-600 dark:text-coffee-300 hover:bg-coffee-50 dark:hover:bg-coffee-800 hover:text-coffee-900 dark:hover:text-coffee-100
                ${className}
            `}
        >
            {children}
        </button>
    )
}

// Direct NavItem
export const NavigationItemDirect: React.FC<{ to: string; children: React.ReactNode; end?: boolean }> = ({ to, children, end }) => {
  return (
      <NavLink 
        to={to} 
        end={end}
        className={({ isActive }) => 
          `relative group/link isolate inline-flex h-10 w-max items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none ${isActive ? 'text-coffee-900 dark:text-coffee-100' : 'text-coffee-700 dark:text-coffee-300 hover:text-coffee-900 dark:hover:text-coffee-100'}`
        }
      >
        {({ isActive }) => (
            <>
                <span className="relative z-10">
                    {children}
                </span>
                
                {isActive ? (
                    <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-coffee-100 dark:bg-coffee-800 rounded-full -z-10"
                        transition={TRANSITIONS.softSpring}
                    />
                ) : (
                    <div className="absolute inset-0 bg-transparent group-hover/link:bg-coffee-50 dark:group-hover/link:bg-coffee-800 rounded-full -z-10 transition-colors duration-200" />
                )}
            </>
        )}
      </NavLink>
  );
}
