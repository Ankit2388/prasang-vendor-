'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, ShieldCheck, ChefHat, CalendarCheck } from 'lucide-react';
import { ThemeToggle, LanguageToggle } from '@/components/layout/theme-language-toggles';
import { useLanguage } from '@/context/language-context';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--app-background)]">
        <Spinner size="lg" label="Prasang Vendor Portal..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--app-background)]">
      {/* Top Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-[var(--app-border)] bg-[var(--app-surface)]/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--app-primary)] text-white flex items-center justify-center font-black text-xl shadow-md">
            P
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-[var(--app-text-primary)]">
              PRASANG
            </h1>
            <p className="text-2xs font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
              Vendor & Catering Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageToggle />
          <Link href="/login">
            <Button variant="outline" size="sm">
              {t('auth.loginLink', 'Sign In')}
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm">
              {t('auth.registerButton', 'Register Business')}
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--app-primary-100)] text-[var(--app-primary)] text-xs font-bold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>India&apos;s Dedicated Catering & Event Management Platform</span>
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[var(--app-text-primary)] tracking-tight leading-tight mb-6">
          Empowering Caterers &amp; Banquets to Scale Their Business
        </h2>

        <p className="text-base sm:text-lg text-[var(--app-text-secondary)] max-w-2xl mb-10 leading-relaxed">
          Manage wedding feasts, custom catering menus, dish catalogs, guest capacity, and client estimation requests seamlessly from one unified vendor dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Link href="/login">
            <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Access Vendor Dashboard
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline">
              Register New Catering Brand
            </Button>
          </Link>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full text-left">
          <div className="p-6 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[var(--app-primary-100)] text-[var(--app-primary)] flex items-center justify-center mb-3">
              <ChefHat className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[var(--app-text-primary)] mb-1">
              Custom Menus &amp; Dishes
            </h3>
            <p className="text-xs text-[var(--app-text-secondary)]">
              Build thalis, buffet tiers, starter platters, and manage real-time dish availability.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[var(--app-text-primary)] mb-1">
              Client Estimations
            </h3>
            <p className="text-xs text-[var(--app-text-secondary)]">
              Receive wedding &amp; corporate inquiries with guest counts, event dates, and menu preferences.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[var(--app-text-primary)] mb-1">
              Verified Business Profile
            </h3>
            <p className="text-xs text-[var(--app-text-secondary)]">
              Showcase certifications, operating hours, capacity ranges, and genuine customer ratings.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-[var(--app-border)] text-center text-xs text-[var(--app-text-muted)]">
        &copy; {new Date().getFullYear()} Prasang Catering &amp; Event Management. All rights reserved.
      </footer>
    </div>
  );
}
