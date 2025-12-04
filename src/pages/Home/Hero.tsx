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
      className="px-3 md:px-6 w-full mb-12"
      aria-label="Welcome to Coffee and Co"
    >
      <div className="relative h-[90vh] min-h-[700px] w-full rounded-[2.5rem] overflow-hidden flex items-center shadow-2xl shadow-coffee-900/20 group">
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
            className="max-w-2xl text-white pl-4 md:pl-8"
          >
            <motion.div
              variants={VARIANTS.fadeInUp}
              transition={TRANSITIONS.spring}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs font-bold tracking-[0.2em] uppercase shadow-lg hover:bg-white/20 transition-colors cursor-default">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                {t("home.hero.badge")}
              </div>
            </motion.div>

            <motion.h1
              variants={VARIANTS.fadeInUp}
              transition={TRANSITIONS.spring}
              className="text-6xl md:text-8xl font-serif font-bold mb-8 leading-[1.1] drop-shadow-lg whitespace-pre-line tracking-tight"
            >
              {t("home.hero.title")}
            </motion.h1>

            <motion.p
              variants={VARIANTS.fadeInUp}
              transition={TRANSITIONS.spring}
              className="text-lg md:text-2xl text-coffee-100 mb-10 font-light leading-relaxed drop-shadow-md max-w-lg opacity-90"
            >
              {t("home.hero.subtitle")}
            </motion.p>

            <motion.div
              variants={VARIANTS.fadeInUp}
              transition={TRANSITIONS.spring}
              className="flex flex-col sm:flex-row gap-5"
            >
              <Button
                size="lg"
                variant="primary"
                onClick={() => navigate("/menu")}
                className="h-14 px-8 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all duration-300 border-none"
              >
                {t("home.hero.cta")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/about")}
                className="h-14 px-8 text-lg !border-white !text-white bg-white/10 hover:!bg-white/20 hover:!border-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm"
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
