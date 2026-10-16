'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';
import { menuService } from '@/services/menu.service';
import { Menu } from '@/types/menu.types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { ConfirmModal } from '@/components/shared/confirm-modal';
import { EmptyState } from '@/components/shared/empty-state';
import { Spinner } from '@/components/ui/spinner';
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  UtensilsCrossed,
  ArrowRight,
  Store,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { ApiError } from '@/services/api-error';

const menuSchema = z.object({
  name: z.string().min(2, 'Menu package name must be at least 2 characters'),
  category: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type MenuFormData = z.infer<typeof menuSchema>;

export default function MenusPage() {
  const { business } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Menu | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const businessId = business?.id;

  // Query Menus for current business
  const { data: menus = [], isLoading } = useQuery({
    queryKey: ['business-menus', businessId],
    queryFn: () => (businessId ? menuService.getMenusByBusinessId(businessId) : Promise.resolve([])),
    enabled: !!businessId,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MenuFormData>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      name: '',
      category: 'Wedding',
      description: '',
      isActive: true,
    },
  });

  const openCreateModal = () => {
    setEditingMenu(null);
    reset({
      name: '',
      category: 'Wedding',
      description: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (menu: Menu) => {
    setEditingMenu(menu);
    reset({
      name: menu.name,
      category: menu.category || 'Wedding',
      description: menu.description || '',
      isActive: menu.isActive,
    });
    setIsModalOpen(true);
  };

  // Create or Update Mutation
  const saveMutation = useMutation({
    mutationFn: async (data: MenuFormData) => {
      if (editingMenu) {
        return menuService.updateMenu(editingMenu.id, data);
      } else {
        return menuService.createMenu({
          ...data,
          businessId,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-menus', businessId] });
      setIsModalOpen(false);
      setNotification({
        type: 'success',
        message: editingMenu
          ? t('menu.updateSuccess', 'Menu updated successfully!')
          : t('menu.createSuccess', 'Menu created successfully!'),
      });
      setTimeout(() => setNotification(null), 3000);
    },
    onError: (err: unknown) => {
      const msg = err instanceof ApiError ? err.message : 'Failed to save menu package';
      setNotification({ type: 'error', message: msg });
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (menuId: string) => {
      return menuService.deleteMenu(menuId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-menus', businessId] });
      setDeleteTarget(null);
      setNotification({
        type: 'success',
        message: t('menu.deleteSuccess', 'Menu deleted successfully!'),
      });
      setTimeout(() => setNotification(null), 3000);
    },
    onError: (err: unknown) => {
      const msg = err instanceof ApiError ? err.message : 'Failed to delete menu package';
      setNotification({ type: 'error', message: msg });
    },
  });

  return (
    <DashboardLayout pageTitle={t('nav.menus', 'Menus')}>
      <div className="space-y-6">
        {/* Header and Add Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--app-border)] gap-4">
          <div>
            <h2 className="text-2xl font-black text-[var(--app-text-primary)]">
              {t('menu.title', 'Catering Menus & Packages')}
            </h2>
            <p className="text-xs text-[var(--app-text-secondary)] mt-1">
              {t(
                'menu.subtitle',
                'Create and manage catering packages (e.g. Wedding Thali, High Tea, Reception Buffet)'
              )}
            </p>
          </div>

          {businessId && (
            <Button
              onClick={openCreateModal}
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              {t('menu.addMenu', 'Add New Menu')}
            </Button>
          )}
        </div>

        {/* Notifications */}
        {notification && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Prompt to register business if not registered */}
        {!businessId ? (
          <EmptyState
            icon={<Store className="w-6 h-6" />}
            title="Business Registration Required"
            description="You need to set up your business details before creating catering packages and menus."
            actionLabel="Setup Business Details"
            onAction={() => router.push('/business')}
          />
        ) : isLoading ? (
          <div className="py-16 flex justify-center">
            <Spinner size="lg" label="Loading menu packages..." />
          </div>
        ) : menus.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="w-6 h-6" />}
            title="No Menus Created Yet"
            description="Start building your catering packages like Grand Wedding Feasts, Cocktail Evenings, or High-Tea buffets."
            actionLabel={t('menu.addMenu', 'Add First Menu')}
            onAction={openCreateModal}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menus.map((m) => (
              <Card
                key={m.id}
                className="overflow-hidden flex flex-col justify-between hover:border-[var(--app-primary)]/40 transition-all duration-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <Badge variant="gold">{m.category || 'General Catering'}</Badge>
                    <Badge variant={m.isActive ? 'success' : 'neutral'}>
                      {m.isActive ? 'Active' : 'Archived'}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-[var(--app-text-primary)] mb-1">
                    {m.name}
                  </h3>
                  <p className="text-xs text-[var(--app-text-secondary)] line-clamp-2 mb-4">
                    {m.description || 'Complete multi-course banquet feast package.'}
                  </p>

                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--app-surface-2)] text-2xs text-[var(--app-text-secondary)]">
                    <UtensilsCrossed className="w-3.5 h-3.5 text-[var(--app-primary)]" />
                    <span>Included dishes catalog</span>
                  </div>
                </CardContent>

                <div className="p-4 bg-[var(--app-surface-2)]/40 border-t border-[var(--app-border)] flex items-center justify-between">
                  <Link
                    href={`/menu-items?menuId=${m.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--app-primary)] hover:underline"
                  >
                    <span>Manage Dishes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(m)}
                      className="p-1.5 rounded-lg text-[var(--app-text-secondary)] hover:bg-[var(--app-surface)] hover:text-[var(--app-text-primary)] transition-colors cursor-pointer"
                      title="Edit Menu"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(m)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Menu"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Create / Edit Menu Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingMenu ? 'Edit Menu Package' : 'Create New Menu Package'}
          description="Define package category, title, and availability"
        >
          <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4 pt-2">
            <Input
              label={t('menu.name', 'Menu Name') + ' *'}
              placeholder={t('menu.namePlaceholder', 'e.g. Grand Wedding Feast')}
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label={t('menu.category', 'Category')}
              placeholder={t('menu.categoryPlaceholder', 'e.g. Wedding, Corporate, Reception')}
              error={errors.category?.message}
              {...register('category')}
            />

            <Textarea
              label={t('menu.description', 'Description')}
              placeholder={t('menu.descriptionPlaceholder', 'Included courses and menu overview...')}
              rows={3}
              {...register('description')}
            />

            <div className="flex items-center gap-2.5 pt-2">
              <input
                type="checkbox"
                id="isActiveMenu"
                className="rounded border-[var(--app-border)] text-[var(--app-primary)] focus:ring-[var(--app-primary)] w-4 h-4 cursor-pointer"
                {...register('isActive')}
              />
              <label
                htmlFor="isActiveMenu"
                className="text-xs font-semibold text-[var(--app-text-primary)] cursor-pointer"
              >
                Mark this menu package as currently active
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--app-border)]">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setIsModalOpen(false)}
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={saveMutation.isPending}
              >
                {editingMenu ? t('common.save', 'Save Changes') : t('common.create', 'Create Menu')}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
          title="Delete Menu Package"
          message={`Are you sure you want to delete "${deleteTarget?.name}"? All assigned items will need to be reallocated.`}
          confirmLabel={t('common.delete', 'Delete Menu')}
          cancelLabel={t('common.cancel', 'Cancel')}
          isLoading={deleteMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
}
