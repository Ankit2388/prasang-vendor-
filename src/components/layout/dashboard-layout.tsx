'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';
import { useAuth } from '@/context/auth-context';
import { Spinner } from '@/components/ui/spinner';
import { X } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export function DashboardLayout({ children, pageTitle }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--app-background)]">
        <Spinner size="lg" label="Loading Prasang Portal..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--app-background)]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[var(--app-surface)] shadow-2xl">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-[var(--app-text-muted)] hover:bg-[var(--app-surface-2)]"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar onNavClick={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} title={pageTitle} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
