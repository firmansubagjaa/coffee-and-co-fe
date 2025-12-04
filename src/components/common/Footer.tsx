import React from "react";
import {
  Coffee,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer
      className="bg-coffee-900 dark:bg-[#3C2A21] text-white pt-20 pb-10 transition-colors duration-300"
      role="contentinfo"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
                <Coffee className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <span className="text-2xl font-serif font-bold tracking-wide text-white">
                Coffee & Co
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              {t("footer.brandDesc")}
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="#"
                className="p-2.5 bg-white/5 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="#"
                className="p-2.5 bg-white/5 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="#"
                className="p-2.5 bg-white/5 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h3 className="text-lg font-bold mb-6 text-white">
              {t("footer.explore")}
            </h3>
            <ul className="space-y-4 text-sm text-white/70">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.menu")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.offers")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.rewards")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.locations")}
                </a>
              </li>
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company information">
            <h3 className="text-lg font-bold mb-6 text-white">
              {t("footer.company")}
            </h3>
            <ul className="space-y-4 text-sm text-white/70">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.about")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.careers")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.privacy")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.contact")}
                </a>
              </li>
            </ul>
          </nav>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">
              {t("footer.stayConnected")}
            </h3>
            <ul className="space-y-5 text-sm text-white/70">
              <li className="flex items-start gap-4">
                <MapPin
                  className="h-5 w-5 text-white/50 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span className="leading-relaxed">
                  Jl. Senopati No. 10, Jakarta Selatan, 12190
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Phone
                  className="h-5 w-5 text-white/50 shrink-0"
                  aria-hidden="true"
                />
                <a
                  href="tel:+62215550199"
                  className="hover:text-white transition-colors"
                >
                  +62 21 555 0199
                </a>
              </li>
              <li className="flex items-center gap-4">
                <Mail
                  className="h-5 w-5 text-white/50 shrink-0"
                  aria-hidden="true"
                />
                <a
                  href="mailto:hello@coffeeandco.id"
                  className="hover:text-white transition-colors"
                >
                  hello@coffeeandco.id
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            &copy; {new Date().getFullYear()} Coffee & Co. {t("footer.rights")}
          </p>
          <p className="text-white/60 text-xs">
            Designed with <span className="text-red-400">❤</span> in Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
};
