'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';
import { businessService } from '@/services/business.service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { DayOfWeek } from '@/types/business.types';
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ApiError } from '@/services/api-error';

const DAYS: DayOfWeek[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

const businessFormSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  description: z.string().optional(),
  cuisineTypesString: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  website: z.string().optional(),
  minGuests: z.number().min(0).optional(),
  maxGuests: z.number().min(0).optional(),
  coverImage: z.string().optional(),
  logo: z.string().optional(),
  businessHours: z
    .array(
      z.object({
        day: z.enum([
          'MONDAY',
          'TUESDAY',
          'WEDNESDAY',
          'THURSDAY',
          'FRIDAY',
          'SATURDAY',
          'SUNDAY',
        ]),
        isOpen: z.boolean(),
        openingTime: z.string().optional(),
        closingTime: z.string().optional(),
      })
    )
    .optional(),
});

type BusinessFormData = z.infer<typeof businessFormSchema>;

export default function BusinessPage() {
  const { setBusiness } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: business, isLoading } = useQuery({
    queryKey: ['my-business'],
    queryFn: () => businessService.getMyBusiness(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      businessName: '',
      description: '',
      cuisineTypesString: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      email: '',
      website: '',
      minGuests: 50,
      maxGuests: 2000,
      coverImage: '',
      logo: '',
      businessHours: DAYS.map((day) => ({
        day,
        isOpen: true,
        openingTime: '08:00',
        closingTime: '23:00',
      })),
    },
  });

  // Populate form when business data is available
  useEffect(() => {
    if (business) {
      reset({
        businessName: business.businessName || '',
        description: business.description || '',
        cuisineTypesString: (business.cuisineTypes || []).join(', '),
        address: business.address || '',
        city: business.city || '',
        state: business.state || '',
        pincode: business.pincode || '',
        phone: business.contactInformation?.phone || '',
        email: business.contactInformation?.email || '',
        website: business.contactInformation?.website || '',
        minGuests: business.capacity?.minGuests ?? 50,
        maxGuests: business.capacity?.maxGuests ?? 2000,
        coverImage: business.coverImage || '',
        logo: business.logo || '',
        businessHours:
          business.businessHours && business.businessHours.length > 0
            ? business.businessHours
            : DAYS.map((day) => ({
                day,
                isOpen: true,
                openingTime: '08:00',
                closingTime: '23:00',
              })),
      });
    }
  }, [business, reset]);

  // Create or Update Mutation
  const saveMutation = useMutation({
    mutationFn: async (data: BusinessFormData) => {
      const cuisineTypes = data.cuisineTypesString
        ? data.cuisineTypesString
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean)
        : [];

      const payload = {
        businessName: data.businessName,
        description: data.description,
        cuisineTypes,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        contactInformation: {
          phone: data.phone,
          email: data.email,
          website: data.website,
        },
        capacity: {
          minGuests: data.minGuests,
          maxGuests: data.maxGuests,
        },
        businessHours: data.businessHours,
        coverImage: data.coverImage,
        logo: data.logo,
      };

      if (business && business.id) {
        return businessService.updateBusiness(business.id, payload);
      } else {
        return businessService.createBusiness(payload);
      }
    },
    onSuccess: (saved) => {
      setSuccessMsg(
        business
          ? t('business.updateSuccess', 'Business details updated successfully!')
          : t('business.createSuccess', 'Business profile created successfully!')
      );
      setBusiness(saved);
      queryClient.setQueryData(['my-business'], saved);
      queryClient.invalidateQueries({ queryKey: ['my-business'] });
      queryClient.invalidateQueries({ queryKey: ['vendor-dashboard'] });
      setTimeout(() => setSuccessMsg(null), 4000);
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        setServerError(err.message);
      } else if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError('Failed to save business information.');
      }
    },
  });

  const onSubmit = (data: BusinessFormData) => {
    setServerError(null);
    setSuccessMsg(null);
    saveMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <DashboardLayout pageTitle={t('nav.business', 'Business Details')}>
        <div className="py-16 flex justify-center">
          <Spinner size="lg" label="Loading business details..." />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle={t('nav.business', 'Business Details')}>
      <div className="space-y-6 max-w-5xl">
        {/* Header Notice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--app-border)] gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-[var(--app-text-primary)]">
                {t('business.title', 'Business Information')}
              </h2>
              {business && (
                <Badge variant="success">
                  {business.status || 'APPROVED'}
                </Badge>
              )}
            </div>
            <p className="text-xs text-[var(--app-text-secondary)] mt-1">
              {t(
                'business.subtitle',
                'Configure your catering brand, operating capacity, cuisines, and contact details'
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 text-2xs text-[var(--app-text-muted)] bg-[var(--app-surface-2)] px-3 py-1.5 rounded-xl border border-[var(--app-border)]">
            <Sparkles className="w-3.5 h-3.5 text-[var(--app-accent-gold)]" />
            <span>1:1 Vendor-to-Business Policy Enforced</span>
          </div>
        </div>

        {/* Feedback banners */}
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* General Business Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Store className="w-4 h-4 text-[var(--app-primary)]" />
                <span>Brand &amp; Profile</span>
              </CardTitle>
              <CardDescription>Primary public-facing business identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label={t('business.name', 'Business Name') + ' *'}
                placeholder={t(
                  'business.namePlaceholder',
                  'e.g. Royal Caterers & Event Planners'
                )}
                error={errors.businessName?.message}
                {...register('businessName')}
              />

              <Textarea
                label={t('business.description', 'About Your Business')}
                placeholder={t(
                  'business.descriptionPlaceholder',
                  'Describe your catering heritage, culinary specialties, and service highlights...'
                )}
                rows={3}
                error={errors.description?.message}
                {...register('description')}
              />

              <Input
                label={t('business.cuisines', 'Cuisine Specialties')}
                placeholder={t(
                  'business.cuisinesPlaceholder',
                  'e.g. Gujarati, North Indian, South Indian, Continental, Chinese'
                )}
                helperText="Separate multiple cuisines with commas"
                {...register('cuisineTypesString')}
              />
            </CardContent>
          </Card>

          {/* Location & Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[var(--app-primary)]" />
                  <span>Location &amp; Address</span>
                </CardTitle>
                <CardDescription>Where your kitchen and banquet office operate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3.5">
                <Input
                  label={t('business.address', 'Street Address')}
                  placeholder="e.g. 102, Heritage Plaza, CG Road"
                  {...register('address')}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label={t('business.city', 'City')}
                    placeholder="e.g. Ahmedabad"
                    {...register('city')}
                  />
                  <Input
                    label={t('business.state', 'State')}
                    placeholder="e.g. Gujarat"
                    {...register('state')}
                  />
                </div>
                <Input
                  label={t('business.pincode', 'Pincode')}
                  placeholder="e.g. 380009"
                  {...register('pincode')}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[var(--app-primary)]" />
                  <span>Contact Information</span>
                </CardTitle>
                <CardDescription>Direct reach for wedding organizers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3.5">
                <Input
                  label={t('business.phone', 'Business Phone')}
                  placeholder="e.g. 9812345678"
                  leftIcon={<Phone className="w-3.5 h-3.5" />}
                  {...register('phone')}
                />
                <Input
                  label={t('business.email', 'Business Email')}
                  placeholder="e.g. info@royalcaters.com"
                  type="email"
                  leftIcon={<Mail className="w-3.5 h-3.5" />}
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  label={t('business.website', 'Website URL')}
                  placeholder="e.g. https://royalcaters.com"
                  leftIcon={<Globe className="w-3.5 h-3.5" />}
                  {...register('website')}
                />
              </CardContent>
            </Card>
          </div>

          {/* Event Capacity Limits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-[var(--app-primary)]" />
                <span>Guest Capacity Ranges</span>
              </CardTitle>
              <CardDescription>Limits on the minimum and maximum guests you cater for</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={t('business.minGuests', 'Minimum Guest Capacity')}
                  type="number"
                  min={0}
                  {...register('minGuests', { valueAsNumber: true })}
                />
                <Input
                  label={t('business.maxGuests', 'Maximum Guest Capacity')}
                  type="number"
                  min={0}
                  {...register('maxGuests', { valueAsNumber: true })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Operating Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--app-primary)]" />
                <span>{t('business.hoursTitle', 'Operating Schedule & Availability')}</span>
              </CardTitle>
              <CardDescription>Your weekly booking consultation hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-[var(--app-border)]">
                {DAYS.map((day, index) => (
                  <div
                    key={day}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 w-36">
                      <input
                        type="checkbox"
                        id={`isOpen-${index}`}
                        className="rounded border-[var(--app-border)] text-[var(--app-primary)] focus:ring-[var(--app-primary)] w-4 h-4 cursor-pointer"
                        {...register(`businessHours.${index}.isOpen` as const)}
                      />
                      <label
                        htmlFor={`isOpen-${index}`}
                        className="text-xs font-bold text-[var(--app-text-primary)] cursor-pointer"
                      >
                        {day}
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        className="px-2.5 py-1.5 rounded-lg border border-[var(--app-border)] text-xs bg-[var(--app-surface)] text-[var(--app-text-primary)]"
                        {...register(`businessHours.${index}.openingTime` as const)}
                      />
                      <span className="text-xs text-[var(--app-text-muted)]">to</span>
                      <input
                        type="time"
                        className="px-2.5 py-1.5 rounded-lg border border-[var(--app-border)] text-xs bg-[var(--app-surface)] text-[var(--app-text-primary)]"
                        {...register(`businessHours.${index}.closingTime` as const)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="font-bold px-8"
              isLoading={saveMutation.isPending}
            >
              {business
                ? t('common.save', 'Save Changes')
                : t('business.createBusiness', 'Create Business Profile')}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
