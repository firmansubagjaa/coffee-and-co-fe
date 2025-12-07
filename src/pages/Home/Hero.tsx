import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "../../components/common/Button";
import { useNavigate } from "react-router-dom";
import { VARIANTS, TRANSITIONS } from "../../utils/animations";
import { useLanguage } from "../../contexts/LanguageContext";

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 400]);

  return (
    <section
      className="px-3 md:px-6 w-full mb-8 md:mb-12"
      aria-label="Welcome to Coffee and Co"
    >
      {/* Mobile: 60vh, Desktop: 90vh */}
      <div className="relative h-[60vh] md:h-[90vh] min-h-[400px] md:min-h-[700px] w-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden flex items-center shadow-xl md:shadow-2xl shadow-coffee-900/20 group">
        {/* Background Image with Parallax */}
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/id/42/1920/1080"
            alt="Cozy coffee shop interior with warm lighting and wooden furniture"
            className="w-full h-full object-cover scale-110 transition-transform duration-1000 group-hover:scale-105"
            width={1920}
            height={1080}
            fetchPriority="high"
            decoding="async"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-coffee-950/95 via-coffee-900/60 to-transparent/20"
            aria-hidden="true"
          ></div>
          <div
            className="absolute inset-0 bg-gradient-to-t from-coffee-950/50 via-transparent to-transparent"
            aria-hidden="true"
          ></div>
        </motion.div>

        <div className="container mx-auto px-4 md:px-12 relative z-10">
          <motion.div
            variants={VARIANTS.staggerContainer}
            initial="initial"
            animate="animate"
            className="max-w-2xl text-white pl-2 md:pl-8"
          >
            <motion.div
              variants={VARIANTS.fadeInUp}
              transition={TRANSITIONS.spring}
            >
              {/* Smaller badge on mobile */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 mb-4 md:mb-8 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-[10px] md:text-xs font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase shadow-lg hover:bg-white/20 transition-colors cursor-default">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-success animate-pulse"></span>
                {t("home.hero.badge")}
              </div>
            </motion.div>

            {/* Mobile: 4xl, Desktop: 8xl */}
            <motion.h1
              variants={VARIANTS.fadeInUp}
              transition={TRANSITIONS.spring}
              className="text-4xl md:text-8xl font-serif font-bold mb-4 md:mb-8 leading-[1.1] drop-shadow-lg whitespace-pre-line tracking-tight"
            >
              {t("home.hero.title")}
            </motion.h1>

            {/* Mobile: base, Desktop: 2xl */}
            <motion.p
              variants={VARIANTS.fadeInUp}
              transition={TRANSITIONS.spring}
              className="text-base md:text-2xl text-coffee-100 mb-6 md:mb-10 font-light leading-relaxed drop-shadow-md max-w-lg opacity-90"
            >
              {t("home.hero.subtitle")}
            </motion.p>

            <motion.div
              variants={VARIANTS.fadeInUp}
              transition={TRANSITIONS.spring}
              className="flex flex-col sm:flex-row gap-3 md:gap-5"
            >
              {/* Smaller buttons on mobile */}
              <Button
                size="lg"
                variant="primary"
                onClick={() => navigate("/menu")}
                className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all duration-300 border-none"
              >
                {t("home.hero.cta")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/about")}
                className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg !border-white !text-white bg-white/10 hover:!bg-white/20 hover:!border-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm"
              >
                {t("home.hero.storyCta")}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
