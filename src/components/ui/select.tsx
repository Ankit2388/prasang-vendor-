'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, placeholder, id, ...props }, ref) => {
    const selectId = id || props.name || Math.random().toString(36).substring(2, 9);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-[var(--app-text-secondary)] tracking-wide uppercase">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full appearance-none rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3.5 py-2.5 pr-10 text-sm text-[var(--app-text-primary)] transition-colors focus:border-[var(--app-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--app-ring)] disabled:bg-[var(--app-surface-2)] disabled:cursor-not-allowed',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-200',
              className
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--app-text-muted)]">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error ? (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[var(--app-text-muted)]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
