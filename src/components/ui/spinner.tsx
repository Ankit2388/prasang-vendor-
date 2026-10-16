'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export function Spinner({
  size = 'md',
  className,
  label,
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-[var(--app-primary)]', sizeMap[size])} />
      {label && <p className="text-xs text-[var(--app-text-muted)] font-medium">{label}</p>}
    </div>
  );
}
