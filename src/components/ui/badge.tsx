'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'gold';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'neutral', size = 'sm', children, ...props }: BadgeProps) {
  const variantStyles = {
    primary:
      'bg-[var(--app-primary-100)] text-[var(--app-primary)] border border-[var(--app-primary)]/20',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
    neutral:
      'bg-[var(--app-surface-2)] text-[var(--app-text-secondary)] border border-[var(--app-border)]',
    gold:
      'bg-amber-100/60 text-[var(--app-accent-brown)] border border-[var(--app-accent-gold)]/40 font-semibold',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs rounded-full font-medium',
    md: 'px-3 py-1 text-xs rounded-full font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
