import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Heart, Zap, ChevronDown } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useLanguage } from '../../contexts/LanguageContext';

interface JobPosition {
  id: string;
  titleKey: string;
  descKey: string;
  location: string;
  typeKey: string;
}

const JOBS: JobPosition[] = [
  {
    id: '1',
    titleKey: 'about.careers.jobs.barista.title',
    descKey: 'about.careers.jobs.barista.desc',
    location: 'Jakarta, Senopati',
    typeKey: 'about.careers.types.fullTime',
  },
  {
    id: '2',
    titleKey: 'about.careers.jobs.manager.title',
    descKey: 'about.careers.jobs.manager.desc',
    location: 'Bali, Canggu',
    typeKey: 'about.careers.types.fullTime',
  },
  {
    id: '3',
    titleKey: 'about.careers.jobs.roaster.title',
    descKey: 'about.careers.jobs.roaster.desc',
    location: 'Bandung, Braga',
    typeKey: 'about.careers.types.fullTime',
  },
  {
    id: '4',
    titleKey: 'about.careers.jobs.marketing.title',
    descKey: 'about.careers.jobs.marketing.desc',
    location: 'Remote / Jakarta',
    typeKey: 'about.careers.types.partTime',
  }
];

const JobAccordion: React.FC<{ job: JobPosition }> = ({ job }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="border border-coffee-200 dark:border-coffee-700 rounded-2xl bg-white dark:bg-coffee-900 overflow-hidden hover:border-coffee-400 dark:hover:border-coffee-500 transition-colors">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        <div>
          <h3 className="text-xl font-bold text-coffee-900 dark:text-white">{t(job.titleKey as any)}</h3>
          <div className="flex gap-4 text-sm text-coffee-500 dark:text-coffee-400 mt-1">
            <span>{job.location}</span>
            <span>•</span>
            <span>{t(job.typeKey as any)}</span>
          </div>
        </div>
        <div className={`p-2 rounded-full bg-coffee-50 dark:bg-coffee-800 text-coffee-900 dark:text-white transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="px-6 pb-6 pt-0 text-coffee-600 dark:text-coffee-300 border-t border-coffee-100 dark:border-coffee-800 mt-2 pt-4">
              <p className="mb-6 leading-relaxed">{t(job.descKey as any)}</p>
              <Button size="sm">{t('about.careers.openings.apply')}</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const CareersPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-coffee-950">
      {/* Hero */}
      <section className="bg-coffee-900 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6"
          >
            {t('about.careers.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-coffee-200 max-w-2xl mx-auto"
          >
            {t('about.careers.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-cream-50 dark:bg-coffee-900">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-white mb-4">{t('about.careers.whyUs.title')}</h2>
            <p className="text-coffee-600 dark:text-coffee-300">{t('about.careers.whyUs.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-coffee-800 p-8 rounded-3xl shadow-sm text-center">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-coffee-900 dark:text-white mb-3">{t('about.careers.whyUs.health.title')}</h3>
              <p className="text-coffee-600 dark:text-coffee-300">{t('about.careers.whyUs.health.desc')}</p>
            </div>
            <div className="bg-white dark:bg-coffee-800 p-8 rounded-3xl shadow-sm text-center">
              <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-coffee-900 dark:text-white mb-3">{t('about.careers.whyUs.growth.title')}</h3>
              <p className="text-coffee-600 dark:text-coffee-300">{t('about.careers.whyUs.growth.desc')}</p>
            </div>
            <div className="bg-white dark:bg-coffee-800 p-8 rounded-3xl shadow-sm text-center">
              <div className="w-14 h-14 bg-coffee-100 dark:bg-coffee-700/50 text-coffee-600 dark:text-coffee-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Coffee className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-coffee-900 dark:text-white mb-3">{t('about.careers.whyUs.coffee.title')}</h3>
              <p className="text-coffee-600 dark:text-coffee-300">{t('about.careers.whyUs.coffee.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="mb-12">
           <h2 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-white mb-4">{t('about.careers.openings.title')}</h2>
           <p className="text-coffee-600 dark:text-coffee-300">{t('about.careers.openings.subtitle')}</p>
        </div>

        <div className="space-y-4">
          {JOBS.map((job) => (
            <JobAccordion key={job.id} job={job} />
          ))}
        </div>
        
        <div className="mt-12 text-center p-8 bg-coffee-50 dark:bg-coffee-900 rounded-3xl border border-coffee-100 dark:border-coffee-800">
           <p className="text-coffee-900 dark:text-white font-medium mb-4">{t('about.careers.openings.empty')}</p>
           <p className="text-coffee-600 dark:text-coffee-300 mb-6">
             {t('about.careers.openings.email').split('careers@coffeeandco.id').map((part, i, arr) => (
               <React.Fragment key={i}>
                 {part}
                 {i < arr.length - 1 && <span className="font-bold underline">careers@coffeeandco.id</span>}
               </React.Fragment>
             ))}
           </p>
        </div>
      </section>
    </div>
  );
};