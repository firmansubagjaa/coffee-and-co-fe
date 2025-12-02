import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SEO } from '@/components/common/SEO';
import { Hero } from './Hero';
import { ProductCard } from '../../features/products/ProductCard';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../../services/api';
import { Button } from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { data: products } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Get up to 6 products for the carousel
  const featured = products?.slice(0, 6) || [];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      // Calculate scroll amount based on approximate card width + gap
      const cardWidth = current.children[0]?.getBoundingClientRect().width || 300;
      const scrollAmount = cardWidth + 24; // Width + gap
      
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // Check if we are near the end of the scroll area (with small tolerance)
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;

        if (isAtEnd) {
          // Loop back to start
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll next
          scroll('right');
        }
      }
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <>
      <SEO 
        title="Home" 
        description="Experience the best artisanal coffee in town. Freshly roasted beans, cozy atmosphere, and a community that cares. Visit Coffee & Co today!"
      />
      <div className="min-h-screen bg-white dark:bg-coffee-950">
        {/* Hero Section */}
        <Hero />
        
        {/* Featured Section */}
        {/* Featured Section */}
        <section className="py-32 container mx-auto px-4 md:px-6 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                <div className="flex-1 max-w-2xl">
                    <motion.span 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block text-coffee-600 dark:text-coffee-400 font-bold tracking-widest uppercase text-sm mb-4"
                    >
                        Curated Selection
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-serif font-bold text-coffee-900 dark:text-white mb-6 leading-tight"
                    >
                        {t('home.featured.title')}
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-coffee-600 dark:text-coffee-300 leading-relaxed"
                    >
                        {t('home.featured.subtitle')}
                    </motion.p>
                </div>
                
                {/* Carousel Controls & View Menu */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => scroll('left')}
                            className="p-4 rounded-full border border-coffee-200 dark:border-coffee-700 bg-white/50 dark:bg-coffee-900/50 backdrop-blur-sm text-coffee-700 dark:text-coffee-300 hover:bg-coffee-900 hover:text-white dark:hover:bg-white dark:hover:text-coffee-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-coffee-400 active:scale-95 shadow-sm hover:shadow-lg"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button 
                            onClick={() => scroll('right')}
                            className="p-4 rounded-full border border-coffee-200 dark:border-coffee-700 bg-white/50 dark:bg-coffee-900/50 backdrop-blur-sm text-coffee-700 dark:text-coffee-300 hover:bg-coffee-900 hover:text-white dark:hover:bg-white dark:hover:text-coffee-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-coffee-400 active:scale-95 shadow-sm hover:shadow-lg"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="h-12 w-px bg-coffee-200 dark:bg-coffee-700 mx-4 hidden sm:block"></div>
                    <Button variant="ghost" onClick={() => navigate('/menu')} className="hidden sm:inline-flex gap-3 text-lg font-medium hover:bg-transparent hover:text-coffee-600 dark:hover:text-coffee-300 group">
                        {t('home.hero.secondaryCta')} <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>
            </div>

            {/* Carousel Container */}
            <div 
                className="relative -mx-4 px-4 md:-mx-8 md:px-8"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div 
                    ref={scrollRef}
                    className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-16 pt-8 px-1 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                >
                    {featured.map((product) => (
                        <motion.div 
                            key={product.id} 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5 }}
                            className="snap-center shrink-0 w-[85vw] sm:w-[45vw] md:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)]"
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </div>
                
                {/* Fade Gradients for visual cue */}
                <div className="absolute top-0 bottom-16 left-0 w-12 md:w-24 bg-gradient-to-r from-white dark:from-coffee-950 to-transparent pointer-events-none z-10"></div>
                <div className="absolute top-0 bottom-16 right-0 w-12 md:w-24 bg-gradient-to-l from-white dark:from-coffee-950 to-transparent pointer-events-none z-10"></div>
            </div>
            
            <div className="mt-8 text-center sm:hidden">
                <Button variant="outline" onClick={() => navigate('/menu')} className="w-full py-6 text-lg">{t('home.hero.secondaryCta')}</Button>
            </div>
        </section>

        {/* About Teaser */}
        {/* About Teaser */}
        <section className="py-32 bg-cream-50 dark:bg-coffee-900 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-coffee-100/50 dark:bg-coffee-800/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/50 dark:bg-coffee-950/20 rounded-full blur-3xl -ml-20 -mb-20"></div>
            </div>

            <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-20 items-center relative z-10">
                <div className="relative order-2 lg:order-1">
                    <div className="relative z-10">
                        <img 
                            src="https://picsum.photos/id/431/600/700" 
                            alt="Barista pouring coffee" 
                            className="rounded-[2.5rem] shadow-2xl w-full object-cover aspect-[4/5] transform hover:scale-[1.02] transition-transform duration-700"
                        />
                        
                        {/* Floating Card */}
                        <div className="absolute -bottom-10 -right-10 md:bottom-10 md:-right-10 bg-white dark:bg-coffee-800 p-8 rounded-[2rem] shadow-xl max-w-xs animate-float hidden md:block border border-coffee-50 dark:border-coffee-700">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-coffee-500 dark:text-coffee-400 font-medium">{t('home.freshness.title')}</p>
                                    <p className="text-lg font-bold text-coffee-900 dark:text-white">{t('home.freshness.subtitle')}</p>
                                </div>
                            </div>
                            <p className="text-coffee-600 dark:text-coffee-300 text-sm leading-relaxed">
                                {t('home.freshness.description')}
                            </p>
                        </div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-coffee-200 dark:bg-coffee-700 rounded-full -z-10 opacity-50 blur-2xl"></div>
                    <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-cream-200 dark:bg-coffee-800 rounded-full -z-10 opacity-50 blur-2xl"></div>
                </div>
                
                <div className="order-1 lg:order-2">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-5 py-2 rounded-full bg-white dark:bg-coffee-800 border border-coffee-100 dark:border-coffee-700 text-coffee-800 dark:text-coffee-100 text-xs font-bold tracking-widest uppercase mb-8 shadow-sm">
                            {t('home.philosophy.badge')}
                        </span>
                        <h2 className="text-5xl md:text-7xl font-serif font-bold text-coffee-900 dark:text-white mb-8 leading-none">
                            {t('home.philosophy.title')}
                        </h2>
                        <p className="text-xl text-coffee-600 dark:text-coffee-300 mb-10 leading-relaxed font-light">
                            {t('home.philosophy.description')}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-12 mb-12 border-t border-b border-coffee-200 dark:border-coffee-700 py-8">
                            <div>
                                <h4 className="text-4xl font-bold text-coffee-900 dark:text-white mb-2">100%</h4>
                                <p className="text-coffee-500 dark:text-coffee-400 font-medium uppercase tracking-wide text-sm">{t('home.philosophy.stat1')}</p>
                            </div>
                            <div>
                                <h4 className="text-4xl font-bold text-coffee-900 dark:text-white mb-2">25+</h4>
                                <p className="text-coffee-500 dark:text-coffee-400 font-medium uppercase tracking-wide text-sm">{t('home.philosophy.stat2')}</p>
                            </div>
                        </div>
                        
                        <Button 
                            size="lg" 
                            onClick={() => navigate('/about')}
                            className="h-14 px-10 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-coffee-900 text-white hover:bg-coffee-800"
                        >
                            {t('home.philosophy.cta')}
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    </div>
    </>
  );
};
