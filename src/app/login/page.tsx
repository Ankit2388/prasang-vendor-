'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ThemeToggle, LanguageToggle } from '@/components/layout/theme-language-toggles';
import { Phone, Lock, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ApiError } from '@/services/api-error';

const loginSchema = z.object({
  mobileNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number (starting with 6-9)'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      mobileNumber: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      await login(data);
      setSuccessMsg(t('auth.loginSuccess', 'Welcome back! Login successful.'));
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setServerError(err.message);
      } else if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError('Authentication failed. Please verify credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoVendor = () => {
    setValue('mobileNumber', '9812345678', { shouldValidate: true });
    setValue('password', 'VendorPassword@123', { shouldValidate: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--app-background)]">
      {/* Top Bar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-[var(--app-border)] bg-[var(--app-surface)]/60 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[var(--app-primary)] text-white flex items-center justify-center font-black text-lg shadow-sm">
            P
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-[var(--app-text-primary)]">
              PRASANG
            </h1>
            <p className="text-2xs font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
              Vendor Portal
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </header>

      {/* Main Form Center */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <Card className="border-[var(--app-border)] shadow-lg bg-[var(--app-surface)]">
            <CardHeader className="text-center pb-2">
              <div className="w-12 h-12 rounded-2xl bg-[var(--app-primary-50)] text-[var(--app-primary)] flex items-center justify-center mx-auto mb-3 shadow-2xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl font-black">
                {t('auth.loginTitle', 'Vendor Sign In')}
              </CardTitle>
              <CardDescription>
                {t('auth.loginSubtitle', 'Access your catering dashboard and business portal')}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-5">
              {/* Demo Fill Quick Action */}
              <div className="p-3 rounded-xl bg-[var(--app-surface-2)] border border-[var(--app-border)] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[var(--app-text-primary)]">Testing Account?</p>
                  <p className="text-2xs text-[var(--app-text-muted)]">Quick fill demo credentials</p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={fillDemoVendor}
                  className="text-xs font-semibold"
                >
                  Use Demo
                </Button>
              </div>

              {serverError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{serverError}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label={t('auth.mobileNumber', 'Mobile Number')}
                  placeholder={t('auth.mobilePlaceholder', '10-digit Indian mobile number')}
                  type="tel"
                  maxLength={10}
                  leftIcon={<Phone className="w-4 h-4" />}
                  error={errors.mobileNumber?.message}
                  {...register('mobileNumber')}
                />

                <Input
                  label={t('auth.password', 'Password')}
                  placeholder={t('auth.passwordPlaceholder', 'Enter secure password')}
                  type="password"
                  leftIcon={<Lock className="w-4 h-4" />}
                  error={errors.password?.message}
                  {...register('password')}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full mt-2 font-bold"
                  isLoading={isSubmitting}
                >
                  {t('auth.signInButton', 'Sign In to Dashboard')}
                </Button>
              </form>

              <div className="text-center pt-2">
                <p className="text-xs text-[var(--app-text-secondary)]">
                  {t('auth.noAccount', "Don't have a vendor account yet?")}{' '}
                  <Link
                    href="/register"
                    className="font-bold text-[var(--app-primary)] hover:underline"
                  >
                    {t('auth.registerLink', 'Register your catering business')}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
