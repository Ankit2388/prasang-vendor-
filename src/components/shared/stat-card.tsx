'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatCard({ title, value, subtitle, icon, iconBg, trend }: StatCardProps) {
  return (
    <Card className="p-6 relative overflow-hidden group hover:border-[var(--app-primary)]/40 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
            {title}
          </p>
          <h4 className="text-3xl font-extrabold text-[var(--app-text-primary)] tracking-tight">
            {value}
          </h4>
          {subtitle && (
            <p className="text-xs text-[var(--app-text-secondary)] pt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1.5 pt-1">
              <span
                className={cn(
                  'text-xs font-bold px-1.5 py-0.5 rounded-sm',
                  trend.isPositive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                )}
              >
                {trend.value}
              </span>
              <span className="text-xs text-[var(--app-text-muted)]">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            'w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-200 shadow-xs',
            iconBg || 'bg-[var(--app-primary-50)] text-[var(--app-primary)]'
          )}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
