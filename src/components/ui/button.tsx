'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variantStyles = {
      primary:
        'bg-[var(--app-primary)] text-white hover:bg-[var(--app-primary-hover)] shadow-sm hover:shadow focus:ring-[var(--app-primary)]',
      secondary:
        'bg-[var(--app-surface-2)] text-[var(--app-text-primary)] hover:bg-[var(--app-border)] focus:ring-[var(--app-border)]',
      outline:
        'border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-primary)] hover:bg-[var(--app-surface-2)] focus:ring-[var(--app-primary)]',
      ghost:
        'bg-transparent text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)] hover:bg-[var(--app-surface-2)] focus:ring-[var(--app-primary)]',
      danger:
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5 font-semibold',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {!isLoading && leftIcon}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
