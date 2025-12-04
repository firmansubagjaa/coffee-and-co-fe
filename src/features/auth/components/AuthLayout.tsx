
import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Star, Globe } from 'lucide-react';
import { APP_NAME } from '../../../utils/constants';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  const { t, language, setLanguage } = useLanguage();
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };
  
  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-coffee-950 overflow-hidden">
      {/* Left Side - Visual - Desktop Only */}
      {/* Hidden on mobile and tablet (below lg breakpoint: 1024px) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden lg:flex relative w-[45%] bg-gradient-to-br from-coffee-800 via-coffee-900 to-black p-12 text-white flex-col justify-between overflow-hidden min-h-screen"
      >
          {/* Abstract Blur/Gradient Orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-coffee-600/30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

          {/* Logo/Brand */}
          <Link to="/" className="relative z-10 w-max">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 hover:bg-white/20 transition-colors">
                  <Coffee className="h-6 w-6 text-white" />
              </div>
          </Link>

          <div className="relative z-10 space-y-6 my-auto">
              <div className="w-10 h-10">
                  <Star className="h-8 w-8 text-yellow-300 fill-yellow-300 animate-pulse" />
              </div>
              <h2 className="text-5xl font-serif font-bold leading-tight">
                  {t('auth.layout.title').split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line.includes('Daily Brew') ? (
                         <>
                           {line.split('Daily Brew')[0]}
                           <span className="text-coffee-200">Daily Brew</span>
                           {line.split('Daily Brew')[1]}
                         </>
                      ) : (
                        line
                      )}
                      {i < t('auth.layout.title').split('\n').length - 1 && <br/>}
                    </React.Fragment>
                  ))}
              </h2>
              <p className="text-coffee-100/80 text-lg font-light max-w-sm">
                  {t('auth.layout.subtitle')}
              </p>
          </div>

          <div className="relative z-10 text-xs text-coffee-400 font-medium tracking-widest uppercase">
              {t('auth.layout.est', { appName: APP_NAME })}
          </div>
      </motion.div>

      {/* Right Side - Form - Full Width on Mobile/Tablet */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 md:p-12 lg:p-20 bg-white dark:bg-coffee-950 relative">
        
        {/* Mobile/Tablet Logo Header (Visible only when sidebar is hidden) */}
        <div className="absolute top-6 left-6 lg:hidden">
            <Link to="/" className="flex items-center gap-2 group">
                 <div className="w-10 h-10 bg-coffee-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-coffee-900 shadow-md group-hover:scale-105 transition-transform">
                    <Coffee className="h-5 w-5" />
                 </div>
                 <span className="font-serif font-bold text-coffee-900 dark:text-white text-lg tracking-tight">{APP_NAME}</span>
            </Link>
        </div>

        {/* Language Toggle - Top Right */}
        <button
          onClick={toggleLanguage}
          className="absolute top-6 right-6 flex items-center gap-2 px-3 py-2 rounded-lg bg-coffee-100 dark:bg-coffee-800 text-coffee-700 dark:text-coffee-300 hover:bg-coffee-200 dark:hover:bg-coffee-700 transition-colors font-medium text-sm"
          aria-label="Toggle Language"
        >
          <Globe className="w-4 h-4" />
          <span className="uppercase">{language}</span>
        </button>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-md mt-16 lg:mt-0"
        >
            <div className="mb-10">
                <div className="w-8 h-8 text-coffee-600 dark:text-coffee-400 mb-4 hidden lg:block">
                    <Star className="h-6 w-6 fill-current" />
                </div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-white mb-3">{title}</h1>
                <p className="text-coffee-500 dark:text-coffee-400 text-lg">{subtitle}</p>
            </div>
            
            {children}
        </motion.div>
      </div>
    </div>
  );
};
