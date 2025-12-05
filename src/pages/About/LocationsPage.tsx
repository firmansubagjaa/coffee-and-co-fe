import React from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Loader2 } from "lucide-react";
import { Button } from "../../components/common/Button";
import { useLanguage } from "../../contexts/LanguageContext";
import { SEO } from "@/components/common/SEO";
import { useActiveStores } from "@/api";

export const LocationsPage: React.FC = () => {
  const { data: stores, isLoading, isError } = useActiveStores();
  const [selectedLocation, setSelectedLocation] = React.useState<any>(null);
  const { t } = useLanguage();

  // Set first store as selected when data loads
  React.useEffect(() => {
    if (stores && stores.length > 0 && !selectedLocation) {
      setSelectedLocation(stores[0]);
    }
  }, [stores, selectedLocation]);

  // Generate Google Maps embed URL from coordinates
  const getMapEmbedUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid`;
  };

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
            {t("about.locations.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-coffee-600 dark:text-coffee-300 max-w-xl mx-auto"
          >
            {t("about.locations.subtitle")}
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        {isLoading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-coffee-600" />
          </div>
        )}

        {isError && (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">
              {t("common.error.loadingData")}
            </p>
            <Button onClick={() => window.location.reload()}>
              {t("common.action.retry")}
            </Button>
          </div>
        )}

        {!isLoading && !isError && stores && stores.length === 0 && (
          <div className="text-center py-12">
            <p className="text-coffee-600 dark:text-coffee-300">
              {t("about.locations.noStores")}
            </p>
          </div>
        )}

        {!isLoading &&
          !isError &&
          stores &&
          stores.length > 0 &&
          selectedLocation && (
            <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-300px)] min-h-[600px]">
              {/* List Section */}
              <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                {stores.map((store) => (
                  <motion.button
                    key={store.id}
                    onClick={() => setSelectedLocation(store)}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className={`text-left p-4 rounded-[2rem] border transition-all duration-500 group relative overflow-hidden ${
                      selectedLocation.id === store.id
                        ? "bg-coffee-900 text-white border-coffee-900 shadow-2xl dark:bg-coffee-100 dark:text-coffee-900 dark:border-coffee-100 scale-[1.02] z-10"
                        : "bg-white border-coffee-50 hover:border-coffee-200 hover:shadow-xl dark:bg-coffee-800 dark:border-coffee-700 dark:hover:border-coffee-600 hover:-translate-y-1"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-coffee-100 dark:bg-coffee-800 flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-coffee-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-lg truncate pr-2">
                            {store.name}
                          </h3>
                          {selectedLocation.id === store.id && (
                            <MapPin className="w-5 h-5 text-yellow-400 dark:text-yellow-600 shrink-0" />
                          )}
                        </div>
                        <p
                          className={`text-sm mb-2 line-clamp-1 ${
                            selectedLocation.id === store.id
                              ? "text-coffee-200 dark:text-coffee-600"
                              : "text-coffee-600 dark:text-coffee-300"
                          }`}
                        >
                          {store.address}
                        </p>
                        <div
                          className={`flex items-center gap-4 text-xs ${
                            selectedLocation.id === store.id
                              ? "text-coffee-300 dark:text-coffee-500"
                              : "text-coffee-500 dark:text-coffee-400"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                              {store.opening_hours || "Mon-Sun: 08:00-22:00"}
                            </span>
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
                    src={getMapEmbedUrl(
                      selectedLocation.latitude,
                      selectedLocation.longitude
                    )}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    className="absolute inset-0 dark:grayscale dark:invert dark:contrast-75 dark:opacity-80 transition-all duration-500"
                  ></iframe>
                </div>

                {/* Selected Location Details Card */}
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/95 dark:bg-coffee-800/95 backdrop-blur-md rounded-3xl shadow-lg border border-white/50 dark:border-coffee-700/50 md:max-w-md">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-coffee-100 dark:bg-coffee-700 rounded-2xl flex items-center justify-center shrink-0">
                      <MapPin className="w-10 h-10 text-coffee-600 dark:text-coffee-300" />
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <h3 className="font-serif font-bold text-xl text-coffee-900 dark:text-white mb-1">
                        {selectedLocation.name}
                      </h3>
                      <p className="text-sm text-coffee-600 dark:text-coffee-300 mb-1">
                        {selectedLocation.address}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-coffee-500 dark:text-coffee-400 mb-3">
                        <Phone className="w-4 h-4" />
                        <span>
                          {selectedLocation.phone || "Call for hours"}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-max"
                        onClick={() =>
                          window.open(
                            `https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.latitude},${selectedLocation.longitude}`,
                            "_blank"
                          )
                        }
                      >
                        {t("about.locations.getDirections")}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};
