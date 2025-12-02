import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Users, Award } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const SectionFade: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

export const OurStoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="bg-cream-50 dark:bg-coffee-950 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://picsum.photos/id/425/1920/1080" 
            alt="Coffee Roasting" 
            className="w-full h-full object-cover filter brightness-50"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block py-1 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cream-50 text-sm font-bold tracking-widest uppercase mb-6"
          >
            {t('about.story.est')}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight"
          >
            {t('about.story.title').split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i === 0 && <br />}
              </React.Fragment>
            ))}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-coffee-100 max-w-2xl mx-auto leading-relaxed"
          >
            {t('about.story.subtitle')}
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-8 -mt-20 relative z-20">
        {/* Intro Card */}
        <SectionFade>
          <div className="bg-white dark:bg-coffee-900 rounded-[2.5rem] p-8 md:p-16 shadow-xl border border-coffee-50 dark:border-coffee-800 text-center max-w-5xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-white mb-8">{t('about.story.introTitle')}</h2>
            <div className="columns-1 md:columns-2 gap-10 text-left text-coffee-600 dark:text-coffee-300 space-y-4 md:space-y-0 text-lg leading-relaxed">
              <p className="mb-4">
                {t('about.story.introText1')}
              </p>
              <p>
                {t('about.story.introText2')}
              </p>
            </div>
          </div>
        </SectionFade>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <SectionFade delay={0.1}>
            <div className="bg-coffee-900 dark:bg-coffee-800 text-cream-50 dark:text-coffee-100 p-10 rounded-[2rem] h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
                <Leaf className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4">{t('about.story.values.ethicallySourced.title')}</h3>
              <p className="text-coffee-200 dark:text-coffee-300">
                {t('about.story.values.ethicallySourced.desc')}
              </p>
            </div>
          </SectionFade>
          
          <SectionFade delay={0.2}>
            <div className="bg-white dark:bg-coffee-900 p-10 rounded-[2rem] border border-coffee-100 dark:border-coffee-800 shadow-lg h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-coffee-50 dark:bg-coffee-800 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-coffee-600 dark:text-coffee-300" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-coffee-900 dark:text-white mb-4">{t('about.story.values.communityFirst.title')}</h3>
              <p className="text-coffee-600 dark:text-coffee-300">
                {t('about.story.values.communityFirst.desc')}
              </p>
            </div>
          </SectionFade>

          <SectionFade delay={0.3}>
            <div className="bg-yellow-400 dark:bg-yellow-600 p-10 rounded-[2rem] h-full flex flex-col items-center text-center shadow-lg">
              <div className="w-16 h-16 bg-coffee-900/10 dark:bg-coffee-900/30 rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-coffee-900 dark:text-coffee-950" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-coffee-900 dark:text-coffee-950 mb-4">{t('about.story.values.masterRoasted.title')}</h3>
              <p className="text-coffee-800 dark:text-coffee-900 font-medium">
                {t('about.story.values.masterRoasted.desc')}
              </p>
            </div>
          </SectionFade>
        </div>

        {/* Image Split */}
        <SectionFade>
          <div className="flex flex-col md:flex-row gap-0 md:gap-8 bg-white dark:bg-coffee-900 rounded-[2.5rem] overflow-hidden shadow-lg border border-coffee-100 dark:border-coffee-800 mb-24">
            <div className="w-full md:w-1/2 min-h-[400px]">
              <img src="https://picsum.photos/id/766/800/800" alt="Barista Art" className="w-full h-full object-cover" />
            </div>
            <div className="w-full md:w-1/2 p-10 md:p-20 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-white mb-6">{t('about.story.future.title')}</h2>
              <p className="text-coffee-600 dark:text-coffee-300 text-lg leading-relaxed mb-8">
                {t('about.story.future.desc')}
              </p>
              <Button onClick={() => navigate('/menu')} className="self-start">
                {t('about.story.future.cta')}
              </Button>
            </div>
          </div>
        </SectionFade>
      </div>
    </div>
  );
};