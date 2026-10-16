'use client';

import React from 'react';
import { Menu as MenuIcon } from 'lucide-react';
import { ThemeToggle, LanguageToggle } from './theme-language-toggles';
import { useAuth } from '@/context/auth-context';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  title?: string;
}

export function Navbar({ onOpenMobileMenu, title }: NavbarProps) {
  const { business, user } = useAuth();

  return (
    <header className="h-16 border-b border-[var(--app-border)] bg-[var(--app-surface)]/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-[var(--app-text-secondary)] hover:bg-[var(--app-surface-2)] transition-colors cursor-pointer"
          aria-label="Open mobile menu"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
        {title && (
          <h2 className="text-base sm:text-lg font-bold text-[var(--app-text-primary)] tracking-tight">
            {title}
          </h2>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <LanguageToggle />

        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[var(--app-border)]">
          <div className="w-8 h-8 rounded-full bg-[var(--app-primary-100)] text-[var(--app-primary)] font-bold text-xs flex items-center justify-center">
            {user?.firstName?.[0] || 'V'}
          </div>
          <div className="text-left hidden md:block">
            <p className="text-xs font-bold text-[var(--app-text-primary)] leading-none">
              {business?.businessName || user?.firstName || 'My Business'}
            </p>
            <p className="text-2xs text-[var(--app-text-muted)] leading-none mt-1">
              {user?.role || 'VENDOR'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
