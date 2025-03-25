'use client';

import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function Providers({
  children,
  lng,
}: {
  children: React.ReactNode;
  lng: string;
}) {
  return (
    <LanguageProvider initialLng={lng}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </LanguageProvider>
  );
} 