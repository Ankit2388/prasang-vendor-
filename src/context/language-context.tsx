'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Locale, defaultLocale } from '@/i18n/config';
import enMessages from '@/i18n/messages/en.json';
import hiMessages from '@/i18n/messages/hi.json';

type MessagesType = typeof enMessages;

const messagesMap: Record<Locale, MessagesType> = {
  en: enMessages,
  hi: hiMessages,
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'prasang_vendor_language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Locale | null;
      if (saved === 'en' || saved === 'hi') {
        return saved;
      }
    }
    return defaultLocale;
  });

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLocale);
    document.documentElement.lang = newLocale;
  };

  const t = (path: string, fallback?: string): string => {
    const keys = path.split('.');
    const activeMessages = messagesMap[locale] || enMessages;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = activeMessages;
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to English if missing in target language
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let enCurrent: any = enMessages;
        for (const k of keys) {
          if (enCurrent && typeof enCurrent === 'object' && k in enCurrent) {
            enCurrent = enCurrent[k];
          } else {
            return fallback || path;
          }
        }
        return typeof enCurrent === 'string' ? enCurrent : fallback || path;
      }
    }
    return typeof current === 'string' ? current : fallback || path;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
