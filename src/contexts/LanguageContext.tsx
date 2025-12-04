import React, { createContext, useContext, useState, useEffect } from "react";
import { en } from "../locales/en";
import { id } from "../locales/id";

type Language = "en" | "id";
type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return saved === "en" || saved === "id" ? saved : "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  const translations = language === "en" ? en : id;

  const t = (
    path: string,
    params?: Record<string, string | number>
  ): string => {
    const keys = path.split(".");
    let current: any = translations;

    for (const key of keys) {
      if (current[key] === undefined) {
        console.warn(`Translation missing for key: ${path}`);
        return path;
      }
      current = current[key];
    }

    let value = current as string;

    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        // Support both {key} and {{key}} formats for interpolation
        value = value.replace(
          new RegExp(`\\{\\{${key}\\}\\}`, "g"),
          String(val)
        );
        value = value.replace(new RegExp(`\\{${key}\\}`, "g"), String(val));
      });
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
