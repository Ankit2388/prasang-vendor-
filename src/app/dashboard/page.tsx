'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';
import { vendorService } from '@/services/vendor.service';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  FileText,
  Clock,
  CheckCircle,
  Star,
  Store,
  BookOpen,
  UtensilsCrossed,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Users,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, vendor, business } = useAuth();
  const { t } = useLanguage();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['vendor-dashboard'],
    queryFn: () => vendorService.getDashboard(),
  });

  const stats = dashboardData?.dashboardStats || {
    totalQuotations: 12,
    pendingEstimations: 4,
    confirmedBookings: 8,
    rating: business?.averageRating || 4.8,
  };

  return (
    <DashboardLayout pageTitle={t('nav.dashboard', 'Dashboard')}>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-[var(--app-border)] bg-gradient-to-r from-[var(--app-surface)] via-[var(--app-surface)] to-[var(--app-primary-50)] shadow-xs">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--app-primary-100)] text-[var(--app-primary)] text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>
                  {vendor?.status === 'APPROVED' ? 'Verified Catering Partner' : 'Verification Pending'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[var(--app-text-primary)] tracking-tight">
                {user ? `Namaste, ${user.firstName}!` : 'Welcome to Prasang!'}
              </h1>
              <p className="text-sm text-[var(--app-text-secondary)] max-w-xl">
                {business
                  ? `${business.businessName} is currently online. Manage your menus, pricing, and client inquiries.`
                  : t(
                      'business.noBusinessYet',
                      'You haven’t set up your business profile yet. Register your business to start receiving event inquiries.'
                    )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {!business ? (
                <Link href="/business">
                  <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    {t('business.createBusiness', 'Create Business Profile')}
                  </Button>
                </Link>
              ) : (
                <Link href="/business">
                  <Button variant="outline" size="md" leftIcon={<Store className="w-4 h-4" />}>
                    {t('dashboard.manageBusiness', 'Manage Business')}
                  </Button>
                </Link>
              )}
              <Link href="/menu">
                <Button variant="primary" size="md" leftIcon={<BookOpen className="w-4 h-4" />}>
                  {t('dashboard.viewMenus', 'Explore Menus')}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Analytics Stat Cards */}
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <Spinner label="Loading metrics..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title={t('dashboard.stats.quotations', 'Total Quotations')}
              value={stats.totalQuotations}
              subtitle="Sent to event organizers"
              icon={<FileText className="w-6 h-6" />}
              trend={{ value: '+18%', isPositive: true }}
            />
            <StatCard
              title={t('dashboard.stats.pendingEstimations', 'Pending Requests')}
              value={stats.pendingEstimations}
              subtitle="Awaiting price calculation"
              icon={<Clock className="w-6 h-6" />}
              iconBg="bg-amber-100 text-amber-800"
            />
            <StatCard
              title={t('dashboard.stats.confirmedBookings', 'Confirmed Events')}
              value={stats.confirmedBookings}
              subtitle="Upcoming banquets & parties"
              icon={<CheckCircle className="w-6 h-6" />}
              iconBg="bg-emerald-100 text-emerald-800"
              trend={{ value: '+25%', isPositive: true }}
            />
            <StatCard
              title={t('dashboard.stats.averageRating', 'Customer Rating')}
              value={`${stats.rating} ★`}
              subtitle={business ? `Based on ${business.totalReviews || 12} reviews` : 'Verified platform score'}
              icon={<Star className="w-6 h-6" />}
              iconBg="bg-amber-100 text-amber-600"
            />
          </div>
        )}

        {/* Business Overview & Quick Access Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Business Profile Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t('business.title', 'Business Information')}</CardTitle>
                  <CardDescription>
                    Your public catering identity visible to event planners
                  </CardDescription>
                </div>
                {business && (
                  <Badge variant="success" size="md">
                    {business.status || 'APPROVED'}
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                {business ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--app-border)] gap-2">
                      <div>
                        <h4 className="text-lg font-bold text-[var(--app-text-primary)]">
                          {business.businessName}
                        </h4>
                        <p className="text-xs text-[var(--app-text-secondary)] mt-0.5">
                          {business.description || 'Authentic catering and event dining services.'}
                        </p>
                      </div>
                      <Link href="/business">
                        <Button variant="outline" size="sm">
                          Edit Profile
                        </Button>
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--app-surface-2)]">
                        <MapPin className="w-4 h-4 text-[var(--app-primary)] shrink-0" />
                        <div className="truncate">
                          <p className="text-2xs font-bold text-[var(--app-text-muted)] uppercase">
                            City / Location
                          </p>
                          <p className="text-xs font-semibold text-[var(--app-text-primary)] truncate">
                            {business.city || 'Gujarat, India'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--app-surface-2)]">
                        <Users className="w-4 h-4 text-[var(--app-primary)] shrink-0" />
                        <div>
                          <p className="text-2xs font-bold text-[var(--app-text-muted)] uppercase">
                            Capacity
                          </p>
                          <p className="text-xs font-semibold text-[var(--app-text-primary)]">
                            {business.capacity?.minGuests || 50} -{' '}
                            {business.capacity?.maxGuests || 2000} Guests
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--app-surface-2)]">
                        <UtensilsCrossed className="w-4 h-4 text-[var(--app-primary)] shrink-0" />
                        <div>
                          <p className="text-2xs font-bold text-[var(--app-text-muted)] uppercase">
                            Specialties
                          </p>
                          <p className="text-xs font-semibold text-[var(--app-text-primary)]">
                            {business.cuisineTypes?.length || 4} Cuisines
                          </p>
                        </div>
                      </div>
                    </div>

                    {business.cuisineTypes && business.cuisineTypes.length > 0 && (
                      <div className="pt-2">
                        <p className="text-2xs font-bold text-[var(--app-text-muted)] uppercase mb-2">
                          Offered Cuisines
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {business.cuisineTypes.map((c) => (
                            <Badge key={c} variant="neutral">
                              {c}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-3">
                    <p className="text-sm text-[var(--app-text-secondary)]">
                      {t('business.noBusinessYet', 'You haven’t set up your business profile yet.')}
                    </p>
                    <Link href="/business">
                      <Button variant="primary" size="md">
                        {t('business.createBusiness', 'Create Business Profile')}
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Inquiries Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Event Estimations</CardTitle>
                  <CardDescription>Direct client catering requests via Prasang</CardDescription>
                </div>
                <Badge variant="info">4 New Inquiries</Badge>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-[var(--app-border)]">
                  {[
                    {
                      id: 'est_101',
                      client: 'Vikram Mehta',
                      event: 'Grand Wedding Reception',
                      date: '15 Nov 2026',
                      guests: 650,
                      status: 'PENDING_REVIEW',
                    },
                    {
                      id: 'est_102',
                      client: 'Pooja Shah',
                      event: 'Sangeet & Cocktail Dinner',
                      date: '28 Nov 2026',
                      guests: 300,
                      status: 'CONFIRMED',
                    },
                    {
                      id: 'est_103',
                      client: 'Adani Foundation',
                      event: 'Corporate Annual Gala',
                      date: '05 Dec 2026',
                      guests: 1200,
                      status: 'QUOTATION_SENT',
                    },
                  ].map((row) => (
                    <div
                      key={row.id}
                      className="flex items-center justify-between p-4 hover:bg-[var(--app-surface-2)]/40 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-[var(--app-text-primary)]">
                            {row.client}
                          </p>
                          <span className="text-xs text-[var(--app-text-muted)]">•</span>
                          <span className="text-xs text-[var(--app-text-secondary)]">
                            {row.event}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--app-text-muted)]">
                          {row.date} • {row.guests} Guests
                        </p>
                      </div>
                      <Badge
                        variant={
                          row.status === 'CONFIRMED'
                            ? 'success'
                            : row.status === 'PENDING_REVIEW'
                            ? 'warning'
                            : 'primary'
                        }
                      >
                        {row.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.quickActions', 'Quick Actions')}</CardTitle>
                <CardDescription>Manage your catering inventory and offerings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/menu" className="block">
                  <div className="p-3.5 rounded-xl border border-[var(--app-border)] hover:border-[var(--app-primary)] bg-[var(--app-surface-2)]/30 hover:bg-[var(--app-surface-2)] transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[var(--app-primary-100)] text-[var(--app-primary)] flex items-center justify-center">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[var(--app-text-primary)]">
                          {t('nav.menus', 'Menus')}
                        </p>
                        <p className="text-2xs text-[var(--app-text-muted)]">
                          Create wedding &amp; buffet packages
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--app-text-muted)] group-hover:text-[var(--app-primary)] transition-colors" />
                  </div>
                </Link>

                <Link href="/menu-items" className="block">
                  <div className="p-3.5 rounded-xl border border-[var(--app-border)] hover:border-[var(--app-primary)] bg-[var(--app-surface-2)]/30 hover:bg-[var(--app-surface-2)] transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                        <UtensilsCrossed className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[var(--app-text-primary)]">
                          {t('nav.menuItems', 'Menu Items')}
                        </p>
                        <p className="text-2xs text-[var(--app-text-muted)]">
                          Add dishes, pricing &amp; veg tags
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--app-text-muted)] group-hover:text-[var(--app-primary)] transition-colors" />
                  </div>
                </Link>

                <Link href="/business" className="block">
                  <div className="p-3.5 rounded-xl border border-[var(--app-border)] hover:border-[var(--app-primary)] bg-[var(--app-surface-2)]/30 hover:bg-[var(--app-surface-2)] transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                        <Store className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[var(--app-text-primary)]">
                          {t('nav.business', 'Business Details')}
                        </p>
                        <p className="text-2xs text-[var(--app-text-muted)]">
                          Brand info, address &amp; schedule
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--app-text-muted)] group-hover:text-[var(--app-primary)] transition-colors" />
                  </div>
                </Link>

                <Link href="/feedback" className="block">
                  <div className="p-3.5 rounded-xl border border-[var(--app-border)] hover:border-[var(--app-primary)] bg-[var(--app-surface-2)]/30 hover:bg-[var(--app-surface-2)] transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                        <Star className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[var(--app-text-primary)]">
                          {t('nav.feedback', 'Feedback & Reviews')}
                        </p>
                        <p className="text-2xs text-[var(--app-text-muted)]">
                          Read client ratings &amp; reviews
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--app-text-muted)] group-hover:text-[var(--app-primary)] transition-colors" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
