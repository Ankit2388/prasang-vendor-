'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 3, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 9);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[var(--app-text-secondary)] tracking-wide uppercase">
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          rows={rows}
          ref={ref}
          className={cn(
            'w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3.5 py-2.5 text-sm text-[var(--app-text-primary)] placeholder-[var(--app-text-muted)] transition-colors focus:border-[var(--app-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--app-ring)] disabled:bg-[var(--app-surface-2)] disabled:cursor-not-allowed',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-200',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[var(--app-text-muted)]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
