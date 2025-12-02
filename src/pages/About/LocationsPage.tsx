import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import { SEO } from '@/components/common/SEO';

interface Location {
  id: string;
  nameKey: string;
  addressKey: string;
  cityKey: string;
  hours: string;
  phone: string;
  image: string;
  mapEmbedUrl: string;
}

const LOCATIONS: Location[] = [
  {
    id: '1',
    nameKey: 'about.locations.list.senopati.name',
    cityKey: 'about.locations.list.senopati.city',
    addressKey: 'about.locations.list.senopati.address',
    hours: '07:00 - 22:00',
    phone: '+62 21 555 0199',
    image: 'https://picsum.photos/id/42/600/400',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.273033621915!2d106.8077583152955!3d-6.227683995491787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f15053151515%3A0x7440000000000000!2sJl.%20Senopati%2C%20Kebayoran%20Baru%2C%20Jakarta%20Selatan!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid'
  },
  {
    id: '2',
    nameKey: 'about.locations.list.canggu.name',
    cityKey: 'about.locations.list.canggu.city',
    addressKey: 'about.locations.list.canggu.address',
    hours: '06:00 - 20:00',
    phone: '+62 361 555 0200',
    image: 'https://picsum.photos/id/225/600/400',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.095033621915!2d115.1377583152955!3d-8.647683995491787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd2488053151515%3A0x7440000000000000!2sJl.%20Pantai%20Berawa%2C%20Bali!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid'
  },
  {
    id: '3',
    nameKey: 'about.locations.list.braga.name',
    cityKey: 'about.locations.list.braga.city',
    addressKey: 'about.locations.list.braga.address',
    hours: '08:00 - 23:00',
    phone: '+62 22 555 0300',
    image: 'https://picsum.photos/id/431/600/400',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.673033621915!2d107.6077583152955!3d-6.917683995491787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e65053151515%3A0x7440000000000000!2sJl.%20Braga%2C%20Bandung!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid'
  }
];

export const LocationsPage: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = React.useState(LOCATIONS[0]);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-coffee-950 pt-6">
      <SEO 
        title="Locations" 
        description="Find a Coffee & Co near you. Visit our cozy cafes for the perfect cup of coffee, free Wi-Fi, and a welcoming atmosphere in your neighborhood."
      />
      {/* Hero Section */}
      <div className="bg-coffee-50 dark:bg-coffee-900 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold text-coffee-900 dark:text-white mb-4"
          >
            {t('about.locations.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-coffee-600 dark:text-coffee-300 max-w-xl mx-auto"
          >
            {t('about.locations.subtitle')}
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-300px)] min-h-[600px]">
          
          {/* List Section */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
             {LOCATIONS.map((loc) => (
               <motion.button
                 key={loc.id}
                 onClick={() => setSelectedLocation(loc)}
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className={`text-left p-4 rounded-[2rem] border transition-all duration-500 group relative overflow-hidden ${
                    selectedLocation.id === loc.id 
                    ? 'bg-coffee-900 text-white border-coffee-900 shadow-2xl dark:bg-coffee-100 dark:text-coffee-900 dark:border-coffee-100 scale-[1.02] z-10' 
                    : 'bg-white border-coffee-50 hover:border-coffee-200 hover:shadow-xl dark:bg-coffee-800 dark:border-coffee-700 dark:hover:border-coffee-600 hover:-translate-y-1'
                 }`}
               >
                  <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-coffee-100 dark:bg-coffee-800">
                          <img src={loc.image} alt={t(loc.nameKey as any)} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-lg truncate pr-2">{t(loc.nameKey as any)}</h3>
                            {selectedLocation.id === loc.id && <MapPin className="w-5 h-5 text-yellow-400 dark:text-yellow-600 shrink-0" />}
                          </div>
                          <p className={`text-sm mb-2 line-clamp-1 ${selectedLocation.id === loc.id ? 'text-coffee-200 dark:text-coffee-600' : 'text-coffee-600 dark:text-coffee-300'}`}>
                            {t(loc.addressKey as any)}
                          </p>
                          <div className={`flex items-center gap-4 text-xs ${selectedLocation.id === loc.id ? 'text-coffee-300 dark:text-coffee-500' : 'text-coffee-500 dark:text-coffee-400'}`}>
                             <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{loc.hours}</span>
                             </div>
                          </div>
                      </div>
                  </div>
               </motion.button>
             ))}
          </div>

          {/* Map & Detail Section */}
          <div className="w-full lg:w-2/3 bg-cream-50 dark:bg-coffee-900 rounded-[2.5rem] overflow-hidden border border-coffee-100 dark:border-coffee-800 shadow-xl relative flex flex-col">
              {/* Map Iframe */}
              <div className="flex-1 relative bg-coffee-200 dark:bg-coffee-800">
                 <iframe 
                    title="Location Map"
                    src={selectedLocation.mapEmbedUrl}
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy"
                    className="absolute inset-0 dark:grayscale dark:invert dark:contrast-75 dark:opacity-80 transition-all duration-500"
                 ></iframe>
              </div>

              {/* Selected Location Image Overlay (Desktop) or Bottom Card (Mobile) */}
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/95 dark:bg-coffee-800/95 backdrop-blur-md rounded-3xl shadow-lg border border-white/50 dark:border-coffee-700/50 md:max-w-md">
                 <div className="flex gap-4">
                    <img 
                        src={selectedLocation.image} 
                        alt={t(selectedLocation.nameKey as any)} 
                        className="w-24 h-24 object-cover rounded-2xl bg-coffee-100 dark:bg-coffee-700"
                    />
                    <div className="flex flex-col justify-center">
                        <h3 className="font-serif font-bold text-xl text-coffee-900 dark:text-white">{t(selectedLocation.nameKey as any)}</h3>
                        <p className="text-sm text-coffee-600 dark:text-coffee-300 mb-2">{t(selectedLocation.cityKey as any)}</p>
                        <Button size="sm" variant="outline" className="w-max">{t('about.locations.getDirections')}</Button>
                    </div>
                 </div>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
};