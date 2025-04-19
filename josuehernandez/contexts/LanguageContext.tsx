// contexts/LanguageContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useTranslation as useClientTranslation } from "@/app/i18n/client";

interface LanguageContextType {
  lng: string;
  changeLanguage: (lng: string) => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// This separate hook follows React's rules properly
export const useTranslationWithContext = (namespace?: string) => {
  const { lng } = useLanguage();
  const { t } = useClientTranslation(lng, namespace);
  return { t, lng };
};

export const LanguageProvider: React.FC<{
  children: React.ReactNode;
  initialLng: string;
}> = ({ children, initialLng }) => {
  const [lng, setLng] = useState(initialLng);

  // Forzar la actualización de i18next cuando cambia el idioma
  useEffect(() => {
    // Asegurar que i18next tenga el idioma correcto
    const i18nLng = localStorage.getItem("i18nextLng");
    if (i18nLng !== lng) {
      localStorage.setItem("i18nextLng", lng);
    }
  }, [lng]);

  const changeLanguage = (newLng: string) => {
    if (newLng !== lng) {
      setLng(newLng);
    }
  };

  // Use useMemo to optimize performance by avoiding unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      lng,
      changeLanguage,
    }),
    [lng]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
