'use client';

import React from 'react';
import { useTheme } from '@/context/theme-context';
import { useLanguage } from '@/context/language-context';
import { locales } from '@/i18n/config';
import { Palette, Globe } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={`Switch to ${theme === 'prasang' ? 'Royal Emerald' : 'Prasang Default'} Theme`}
      className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-primary)] hover:bg-[var(--app-surface-2)] transition-colors cursor-pointer shadow-2xs"
    >
      <Palette className="w-3.5 h-3.5 text-[var(--app-primary)]" />
      <span>{theme === 'prasang' ? 'Prasang Default' : 'Royal Emerald'}</span>
      <span
        className="w-2.5 h-2.5 rounded-full border border-black/10"
        style={{
          backgroundColor: theme === 'prasang' ? '#EF4C18' : '#0F5132',
        }}
      />
    </button>
  );
}

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-2xs">
      <Globe className="w-3.5 h-3.5 text-[var(--app-text-muted)] ml-1.5" />
      {locales.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            locale === l.code
              ? 'bg-[var(--app-primary)] text-white shadow-xs'
              : 'text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]'
          }`}
        >
          {l.nativeName}
        </button>
      ))}
    </div>
  );
}
