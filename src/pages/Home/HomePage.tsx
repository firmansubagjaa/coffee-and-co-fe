
import React, { useRef, useState, useEffect } from 'react';
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
    <div className="bg-cream-50 dark:bg-coffee-950">
      <Hero />
      
      {/* Featured Section */}
      <section className="py-24 container mx-auto px-4 md:px-6 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="flex-1">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-coffee-900 dark:text-white mb-3">{t('home.featured.title')}</h2>
                <p className="text-lg text-coffee-600 dark:text-coffee-300">{t('home.featured.subtitle')}</p>
            </div>
            
            {/* Carousel Controls & View Menu */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => scroll('left')}
                        className="p-3 rounded-full border border-coffee-200 dark:border-coffee-700 text-coffee-700 dark:text-coffee-300 hover:bg-coffee-100 dark:hover:bg-coffee-800 hover:text-coffee-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-coffee-400 active:scale-95"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button 
                        onClick={() => scroll('right')}
                        className="p-3 rounded-full border border-coffee-200 dark:border-coffee-700 text-coffee-700 dark:text-coffee-300 hover:bg-coffee-100 dark:hover:bg-coffee-800 hover:text-coffee-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-coffee-400 active:scale-95"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
                <div className="h-8 w-px bg-coffee-200 dark:bg-coffee-700 mx-2 hidden sm:block"></div>
                <Button variant="ghost" onClick={() => navigate('/menu')} className="hidden sm:inline-flex gap-2 text-lg">
                    {t('home.hero.secondaryCta')} <ArrowRight className="h-5 w-5" />
                </Button>
            </div>
        </div>

        {/* Carousel Container */}
        <div 
            className="relative -mx-4 px-4 md:-mx-6 md:px-6"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div 
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-12 pt-4 px-1 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
            >
                {featured.map((product) => (
                    <div 
                        key={product.id} 
                        className="snap-center shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
            
            {/* Fade Gradients for visual cue */}
            <div className="absolute top-0 bottom-12 left-0 w-8 md:w-12 bg-gradient-to-r from-cream-50 dark:from-coffee-950 to-transparent pointer-events-none z-10"></div>
            <div className="absolute top-0 bottom-12 right-0 w-8 md:w-12 bg-gradient-to-l from-cream-50 dark:from-coffee-950 to-transparent pointer-events-none z-10"></div>
        </div>
        
        <div className="mt-4 text-center sm:hidden">
            <Button variant="outline" onClick={() => navigate('/menu')}>{t('home.hero.secondaryCta')}</Button>
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-24 bg-white dark:bg-coffee-900">
        <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 md:order-1">
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-coffee-100 dark:bg-coffee-800 rounded-full -z-10"></div>
                <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-cream-100 dark:bg-coffee-800/50 rounded-full -z-10"></div>
                <img 
                    src="https://picsum.photos/id/431/600/600" 
                    alt="Barista pouring coffee" 
                    className="rounded-[2.5rem] shadow-2xl w-full object-cover aspect-[4/5]"
                />
            </div>
            <div className="order-1 md:order-2">
                <span className="inline-block px-4 py-1.5 rounded-full bg-coffee-100 dark:bg-coffee-800 text-coffee-800 dark:text-coffee-100 text-sm font-bold tracking-wide uppercase mb-6">{t('home.philosophy.badge')}</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-coffee-900 dark:text-white mb-6 leading-tight whitespace-pre-line">
                    {t('home.philosophy.title')}
                </h2>
                <p className="text-lg text-coffee-600 dark:text-coffee-300 mb-8 leading-relaxed">
                    {t('home.philosophy.description')}
                </p>
                <div className="grid grid-cols-2 gap-8 mb-10">
                    <div>
                        <h4 className="text-3xl font-bold text-coffee-800 dark:text-coffee-100 mb-1">100%</h4>
                        <p className="text-coffee-500 dark:text-coffee-400">{t('home.philosophy.stat1')}</p>
                    </div>
                    <div>
                        <h4 className="text-3xl font-bold text-coffee-800 dark:text-coffee-100 mb-1">25+</h4>
                        <p className="text-coffee-500 dark:text-coffee-400">{t('home.philosophy.stat2')}</p>
                    </div>
                </div>
                <Button size="lg" onClick={() => navigate('/about')}>{t('home.philosophy.cta')}</Button>
            </div>
        </div>
      </section>
    </div>
  );
};
