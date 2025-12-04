import React from "react";
import { motion } from "framer-motion";
import { Leaf, Users, Award } from "lucide-react";
import { Button } from "../../components/common/Button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { SEO } from "@/components/common/SEO";

const SectionFade: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => (
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
    <div className="min-h-screen bg-cream-50 dark:bg-coffee-950 pt-6">
      <SEO
        title="Our Story"
        description="Discover the passion behind Coffee & Co. From humble beginnings to a community-driven coffee haven, read our journey of flavor and dedication."
      />
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] overflow-hidden flex items-center justify-center group">
        <div className="absolute inset-0">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            src="https://picsum.photos/id/425/1920/1080"
            alt="Coffee Roasting"
            className="w-full h-full object-cover filter brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block py-2 px-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cream-50 text-sm font-bold tracking-[0.2em] uppercase mb-8 shadow-lg"
          >
            {t("about.story.est")}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-serif font-bold text-white mb-8 leading-tight drop-shadow-2xl"
          >
            {t("about.story.title")
              .split("\n")
              .map((line, i) => (
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
            className="text-xl md:text-2xl text-coffee-100 max-w-3xl mx-auto leading-relaxed font-light"
          >
            {t("about.story.subtitle")}
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-8 -mt-20 relative z-20">
        {/* Intro Card */}
        <SectionFade>
          <div className="bg-white dark:bg-coffee-900 rounded-[2.5rem] p-8 md:p-16 shadow-xl border border-coffee-50 dark:border-coffee-800 text-center max-w-5xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-white mb-8">
              {t("about.story.introTitle")}
            </h2>
            <div className="columns-1 md:columns-2 gap-10 text-left text-coffee-600 dark:text-coffee-300 space-y-4 md:space-y-0 text-lg leading-relaxed">
              <p className="mb-4">{t("about.story.introText1")}</p>
              <p>{t("about.story.introText2")}</p>
            </div>
          </div>
        </SectionFade>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <SectionFade delay={0.1}>
            <div className="bg-white dark:bg-coffee-800 p-10 rounded-[2rem] border border-coffee-100 dark:border-coffee-700 shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-success/10 dark:bg-success/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Leaf className="w-10 h-10 text-success" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-coffee-900 dark:text-white mb-4">
                {t("about.story.values.ethicallySourced.title")}
              </h3>
              <p className="text-coffee-600 dark:text-coffee-300 leading-relaxed">
                {t("about.story.values.ethicallySourced.desc")}
              </p>
            </div>
          </SectionFade>

          <SectionFade delay={0.2}>
            <div className="bg-white dark:bg-coffee-800 p-10 rounded-[2rem] border border-coffee-100 dark:border-coffee-700 shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-coffee-50 dark:bg-coffee-700/50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Users className="w-10 h-10 text-coffee-600 dark:text-coffee-300" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-coffee-900 dark:text-white mb-4">
                {t("about.story.values.communityFirst.title")}
              </h3>
              <p className="text-coffee-600 dark:text-coffee-300 leading-relaxed">
                {t("about.story.values.communityFirst.desc")}
              </p>
            </div>
          </SectionFade>

          <SectionFade delay={0.3}>
            <div className="bg-white dark:bg-coffee-800 p-10 rounded-[2rem] border border-coffee-100 dark:border-coffee-700 shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Award className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-coffee-900 dark:text-white mb-4">
                {t("about.story.values.masterRoasted.title")}
              </h3>
              <p className="text-coffee-600 dark:text-coffee-300 leading-relaxed">
                {t("about.story.values.masterRoasted.desc")}
              </p>
            </div>
          </SectionFade>
        </div>

        {/* Image Split */}
        <SectionFade>
          <div className="flex flex-col md:flex-row gap-0 md:gap-8 bg-white dark:bg-coffee-900 rounded-[2.5rem] overflow-hidden shadow-lg border border-coffee-100 dark:border-coffee-800 mb-24">
            <div className="w-full md:w-1/2 min-h-[400px]">
              <img
                src="https://picsum.photos/id/766/800/800"
                alt="Barista Art"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 p-10 md:p-20 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-white mb-6">
                {t("about.story.future.title")}
              </h2>
              <p className="text-coffee-600 dark:text-coffee-300 text-lg leading-relaxed mb-8">
                {t("about.story.future.desc")}
              </p>
              <Button onClick={() => navigate("/menu")} className="self-start">
                {t("about.story.future.cta")}
              </Button>
            </div>
          </div>
        </SectionFade>
      </div>
    </div>
  );
};
