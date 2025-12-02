import React from 'react';
import { Coffee, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-coffee-900 text-white mt-20 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/10 rounded-lg">
                <Coffee className="h-6 w-6 text-cream-100" />
              </div>
              <span className="text-xl font-serif font-bold tracking-wide">Coffee & Co</span>
            </div>
            <p className="text-coffee-200 text-sm leading-relaxed">
              {t('footer.brandDesc')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/20 transition-colors text-cream-100">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/20 transition-colors text-cream-100">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/20 transition-colors text-cream-100">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-cream-100">{t('footer.explore')}</h3>
            <ul className="space-y-4 text-sm text-coffee-200">
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cream-500/50"></span>{t('footer.menu')}
              </a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cream-500/50"></span>{t('footer.offers')}
              </a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cream-500/50"></span>{t('footer.rewards')}
              </a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cream-500/50"></span>{t('footer.locations')}
              </a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-cream-100">{t('footer.company')}</h3>
            <ul className="space-y-4 text-sm text-coffee-200">
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cream-500/50"></span>{t('footer.about')}
              </a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cream-500/50"></span>{t('footer.careers')}
              </a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cream-500/50"></span>{t('footer.privacy')}
              </a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cream-500/50"></span>{t('footer.contact')}
              </a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-cream-100">{t('footer.stayConnected')}</h3>
            <ul className="space-y-4 text-sm text-coffee-200">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-cream-500 shrink-0" />
                <span>Jl. Senopati No. 10, Jakarta Selatan, 12190</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-cream-500 shrink-0" />
                <span>+62 21 555 0199</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-cream-500 shrink-0" />
                <span>hello@coffeeandco.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-coffee-300 text-sm">
            &copy; {new Date().getFullYear()} Coffee & Co. {t('footer.rights')}
          </p>
          <p className="text-coffee-400 text-xs">
            Designed with <span className="text-red-400">❤</span> in Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
};