'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface)]">
      <div className="w-14 h-14 rounded-2xl bg-[var(--app-primary-50)] text-[var(--app-primary)] flex items-center justify-center mb-4 shadow-xs">
        {icon}
      </div>
      <h3 className="text-base font-bold text-[var(--app-text-primary)]">{title}</h3>
      <p className="text-sm text-[var(--app-text-secondary)] max-w-sm mt-1.5 mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
