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
import { Phone, Lock, User, Mail, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ApiError } from '@/services/api-error';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  mobileNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerVendor } = useAuth();
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
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      mobileNumber: '',
      password: '',
      email: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      await registerVendor(data);
      setSuccessMsg(t('auth.registerSuccess', 'Vendor profile created successfully!'));
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setServerError(err.message);
      } else if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError('Registration failed. Please check form fields.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillRandomVendor = () => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    setValue('firstName', 'Rajesh', { shouldValidate: true });
    setValue('lastName', 'Patel', { shouldValidate: true });
    setValue('mobileNumber', `98${rand}1234`.slice(0, 10), { shouldValidate: true });
    setValue('password', 'VendorPass@123', { shouldValidate: true });
    setValue('email', `rajesh${rand}@prasangcaterers.com`, { shouldValidate: true });
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

      {/* Main Registration Box */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-lg space-y-6">
          <Card className="border-[var(--app-border)] shadow-lg bg-[var(--app-surface)]">
            <CardHeader className="text-center pb-2">
              <div className="w-12 h-12 rounded-2xl bg-[var(--app-primary-50)] text-[var(--app-primary)] flex items-center justify-center mx-auto mb-3 shadow-2xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl font-black">
                {t('auth.registerTitle', 'Register as a Vendor')}
              </CardTitle>
              <CardDescription>
                {t(
                  'auth.registerSubtitle',
                  'Join Prasang to expand your catering reach and event bookings'
                )}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-5">
              {/* Quick Fill Demo */}
              <div className="p-3 rounded-xl bg-[var(--app-surface-2)] border border-[var(--app-border)] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[var(--app-text-primary)]">Fast Onboarding Demo?</p>
                  <p className="text-2xs text-[var(--app-text-muted)]">Generate random test vendor details</p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={fillRandomVendor}
                  className="text-xs font-semibold"
                >
                  Fill Sample
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label={t('auth.firstName', 'First Name')}
                    placeholder={t('auth.firstNamePlaceholder', 'e.g. Rajesh')}
                    leftIcon={<User className="w-4 h-4" />}
                    error={errors.firstName?.message}
                    {...register('firstName')}
                  />
                  <Input
                    label={t('auth.lastName', 'Last Name')}
                    placeholder={t('auth.lastNamePlaceholder', 'e.g. Sharma')}
                    leftIcon={<User className="w-4 h-4" />}
                    error={errors.lastName?.message}
                    {...register('lastName')}
                  />
                </div>

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
                  label={t('auth.email', 'Email Address')}
                  placeholder={t('auth.emailPlaceholder', 'e.g. info@caterer.com')}
                  type="email"
                  leftIcon={<Mail className="w-4 h-4" />}
                  error={errors.email?.message}
                  {...register('email')}
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
                  {t('auth.registerButton', 'Complete Registration')}
                </Button>
              </form>

              <div className="text-center pt-2">
                <p className="text-xs text-[var(--app-text-secondary)]">
                  {t('auth.haveAccount', 'Already registered as a vendor?')}{' '}
                  <Link href="/login" className="font-bold text-[var(--app-primary)] hover:underline">
                    {t('auth.loginLink', 'Sign In here')}
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
