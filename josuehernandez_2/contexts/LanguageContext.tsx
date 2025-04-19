// contexts/LanguageContext.tsx
'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';
import { useTranslation as useClientTranslation } from '@/app/i18n/client';

interface LanguageContextType {
  lng: string;
  changeLanguage: (lng: string) => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
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
  
  const changeLanguage = (newLng: string) => {
    setLng(newLng);
  };
  
  // Use useMemo to optimize performance by avoiding unnecessary re-renders
  const contextValue = useMemo(() => ({
    lng,
    changeLanguage
  }), [lng]);
  
  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};