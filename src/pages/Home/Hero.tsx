
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { VARIANTS, TRANSITIONS } from '../../utils/animations';
import { useLanguage } from '../../contexts/LanguageContext';

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 400]);

  return (
    <section className="px-3 md:px-6 w-full mb-8">
        <div className="relative h-[85vh] min-h-[600px] w-full rounded-[2.5rem] overflow-hidden flex items-center shadow-2xl shadow-coffee-900/20">
            {/* Background Image with Parallax */}
            <motion.div 
                style={{ y }}
                className="absolute inset-0 z-0"
            >
                <img 
                    src="https://picsum.photos/id/42/1920/1080" 
                    alt="Coffee Shop Interior" 
                    className="w-full h-full object-cover scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-coffee-950/90 via-coffee-900/50 to-transparent"></div>
            </motion.div>

            <div className="container mx-auto px-4 md:px-12 relative z-10">
                <motion.div 
                    variants={VARIANTS.staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="max-w-xl text-white pl-4 md:pl-8"
                >
                    <motion.div variants={VARIANTS.fadeInUp} transition={TRANSITIONS.spring}>
                        <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-xs font-bold tracking-widest uppercase shadow-sm">
                            {t('home.hero.badge')}
                        </div>
                    </motion.div>
                    
                    <motion.h1 
                        variants={VARIANTS.fadeInUp} 
                        transition={TRANSITIONS.spring}
                        className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight drop-shadow-lg whitespace-pre-line"
                    >
                        {t('home.hero.title')}
                    </motion.h1>
                    
                    <motion.p 
                        variants={VARIANTS.fadeInUp}
                        transition={TRANSITIONS.spring}
                        className="text-lg md:text-xl text-coffee-50 mb-8 font-light leading-relaxed drop-shadow-md max-w-lg"
                    >
                        {t('home.hero.subtitle')}
                    </motion.p>
                    
                    <motion.div 
                        variants={VARIANTS.fadeInUp}
                        transition={TRANSITIONS.spring}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Button 
                            size="lg" 
                            variant="primary"
                            onClick={() => navigate('/menu')}
                            className="shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            {t('home.hero.cta')}
                        </Button>
                        <Button 
                            size="lg" 
                            variant="outline"
                            onClick={() => navigate('/about')}
                            className="!border-white !text-white hover:!bg-white hover:!text-coffee-900 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-white/5"
                        >
                            {t('home.hero.storyCta')}
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    </section>
  );
};
