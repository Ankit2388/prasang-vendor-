'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/language-context';
import { useAuth } from '@/context/auth-context';
import {
  LayoutDashboard,
  Store,
  BookOpen,
  UtensilsCrossed,
  Star,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  onNavClick?: () => void;
}

export function Sidebar({ onNavClick }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user, vendor, business, logout } = useAuth();

  const navItems = [
    {
      href: '/dashboard',
      label: t('nav.dashboard', 'Dashboard'),
      icon: LayoutDashboard,
    },
    {
      href: '/business',
      label: t('nav.business', 'Business Details'),
      icon: Store,
    },
    {
      href: '/menu',
      label: t('nav.menus', 'Menus'),
      icon: BookOpen,
    },
    {
      href: '/menu-items',
      label: t('nav.menuItems', 'Menu Items'),
      icon: UtensilsCrossed,
    },
    {
      href: '/feedback',
      label: t('nav.feedback', 'Feedback & Reviews'),
      icon: Star,
    },
  ];

  return (
    <aside className="w-68 h-full flex flex-col bg-[var(--app-surface)] border-r border-[var(--app-border)] select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-[var(--app-border)] flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[var(--app-primary)] text-white flex items-center justify-center font-black text-xl shadow-md">
          P
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-lg font-black tracking-tight text-[var(--app-text-primary)]">
              PRASANG
            </h1>
            <Sparkles className="w-3.5 h-3.5 text-[var(--app-accent-gold)]" />
          </div>
          <p className="text-2xs font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
            Vendor Portal
          </p>
        </div>
      </div>

      {/* Business Status Pill */}
      <div className="px-5 py-3 border-b border-[var(--app-border)] bg-[var(--app-surface-2)]/50">
        <div className="flex items-center justify-between">
          <span className="text-2xs font-semibold text-[var(--app-text-secondary)] uppercase">
            {business?.businessName || vendor?.ownerName || 'Catering Partner'}
          </span>
          <Badge
            variant={
              business?.status === 'APPROVED' || vendor?.status === 'APPROVED'
                ? 'success'
                : 'warning'
            }
            size="sm"
          >
            {business?.status || vendor?.status || 'APPROVED'}
          </Badge>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150',
                isActive
                  ? 'bg-[var(--app-primary)] text-white shadow-sm'
                  : 'text-[var(--app-text-secondary)] hover:bg-[var(--app-surface-2)] hover:text-[var(--app-text-primary)]'
              )}
            >
              <Icon className={cn('w-4.5 h-4.5', isActive ? 'text-white' : 'text-[var(--app-text-muted)]')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Footer & Logout */}
      <div className="p-4 border-t border-[var(--app-border)] bg-[var(--app-surface-2)]/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[var(--app-primary-100)] text-[var(--app-primary)] font-bold text-xs flex items-center justify-center shrink-0">
              {user?.firstName?.[0] || 'V'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-[var(--app-text-primary)] truncate">
                {user ? `${user.firstName} ${user.lastName}` : 'Vendor Partner'}
              </p>
              <p className="text-2xs text-[var(--app-text-muted)] truncate">
                {user?.mobileNumber || user?.email || 'Authenticated'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl border border-[var(--app-border)] text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t('nav.logout', 'Logout')}</span>
        </button>
      </div>
    </aside>
  );
}
