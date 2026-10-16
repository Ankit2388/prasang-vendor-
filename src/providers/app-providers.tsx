'use client';

import React from 'react';
import { QueryProvider } from './query-provider';
import { ThemeProvider } from '@/context/theme-context';
import { LanguageProvider } from '@/context/language-context';
import { AuthProvider } from '@/context/auth-context';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
