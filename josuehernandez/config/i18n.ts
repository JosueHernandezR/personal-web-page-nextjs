export const defaultLocale = 'es';
export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};

export const localeFlags: Record<Locale, string> = {
  es: '🇪��',
  en: '🇬🇧',
}; 