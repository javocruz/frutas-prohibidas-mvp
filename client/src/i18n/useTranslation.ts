import { useState, useCallback } from 'react';
import enTranslations from './translations/en.json';
import esTranslations from './translations/es.json';

type Language = 'en' | 'es';
type Translations = typeof enTranslations;

const translations = {
  en: enTranslations,
  es: esTranslations,
};

export function useTranslation() {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback(
    (key: string) => {
      const keys = key.split('.');
      let value: any = translations[language];

      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k];
        } else {
          return key; // Return the key if translation is not found
        }
      }

      return value || key;
    },
    [language]
  );

  const changeLanguage = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
    // You might want to save the language preference in localStorage
    localStorage.setItem('language', newLanguage);
  }, []);

  return {
    t,
    language,
    changeLanguage,
  };
} 