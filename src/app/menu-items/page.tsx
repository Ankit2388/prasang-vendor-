'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';
import { menuService } from '@/services/menu.service';
import { menuItemService } from '@/services/menu-item.service';
import { MenuItem } from '@/types/menu.types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { ConfirmModal } from '@/components/shared/confirm-modal';
import { EmptyState } from '@/components/shared/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { formatCurrency } from '@/lib/utils';
import {
  UtensilsCrossed,
  Plus,
  Pencil,
  Trash2,
  Search,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Leaf,
  Drumstick,
} from 'lucide-react';
import { ApiError } from '@/services/api-error';

const CATEGORIES = [
  'Welcome Drinks & Beverages',
  'Starters & Appetizers',
  'Soups & Salads',
  'Main Course',
  'Breads & Rotis',
  'Rice & Biryani',
  'Desserts & Sweets',
  'Live Counter Specialties',
];

const menuItemSchema = z.object({
  menuId: z.string().min(1, 'Please select a menu package for this dish'),
  name: z.string().min(2, 'Dish name must be at least 2 characters'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(0, 'Price cannot be negative'),
  isVegetarian: z.boolean(),
  isAvailable: z.boolean(),
  description: z.string().optional(),
  image: z.string().optional(),
});

type MenuItemFormData = z.infer<typeof menuItemSchema>;

export default function MenuItemsPage() {
  const { business } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedMenuFilter, setSelectedMenuFilter] = useState<string>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const businessId = business?.id;

  // Fetch menus
  const { data: menus = [] } = useQuery({
    queryKey: ['business-menus', businessId],
    queryFn: () => (businessId ? menuService.getMenusByBusinessId(businessId) : Promise.resolve([])),
    enabled: !!businessId,
  });

  // Fetch menu items for this business
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['business-menu-items', businessId],
    queryFn: () => (businessId ? menuItemService.getItemsByBusinessId(businessId) : Promise.resolve([])),
    enabled: !!businessId,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      menuId: '',
      name: '',
      category: 'Main Course',
      price: 250,
      isVegetarian: true,
      isAvailable: true,
      description: '',
      image: '',
    },
  });

  const openCreateModal = () => {
    setEditingItem(null);
    reset({
      menuId: menus[0]?.id || '',
      name: '',
      category: 'Main Course',
      price: 250,
      isVegetarian: true,
      isAvailable: true,
      description: '',
      image: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    reset({
      menuId: item.menuId,
      name: item.name,
      category: item.category,
      price: item.price,
      isVegetarian: item.isVegetarian,
      isAvailable: item.isAvailable,
      description: item.description || '',
      image: item.image || '',
    });
    setIsModalOpen(true);
  };

  // Create or Update Mutation
  const saveMutation = useMutation({
    mutationFn: async (data: MenuItemFormData) => {
      if (editingItem) {
        return menuItemService.updateMenuItem(editingItem.id, data);
      } else {
        return menuItemService.createMenuItem({
          ...data,
          businessId,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-menu-items', businessId] });
      setIsModalOpen(false);
      setNotification({
        type: 'success',
        message: editingItem
          ? t('menuItems.updateSuccess', 'Dish updated successfully!')
          : t('menuItems.createSuccess', 'Dish added successfully!'),
      });
      setTimeout(() => setNotification(null), 3000);
    },
    onError: (err: unknown) => {
      const msg = err instanceof ApiError ? err.message : 'Failed to save menu dish';
      setNotification({ type: 'error', message: msg });
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (itemId: string) => {
      return menuItemService.deleteMenuItem(itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-menu-items', businessId] });
      setDeleteTarget(null);
      setNotification({
        type: 'success',
        message: t('menuItems.deleteSuccess', 'Dish deleted successfully!'),
      });
      setTimeout(() => setNotification(null), 3000);
    },
    onError: (err: unknown) => {
      const msg = err instanceof ApiError ? err.message : 'Failed to delete dish';
      setNotification({ type: 'error', message: msg });
    },
  });

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesMenu =
        selectedMenuFilter === 'ALL' || item.menuId === selectedMenuFilter;
      const matchesCategory =
        selectedCategoryFilter === 'ALL' || item.category === selectedCategoryFilter;
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesMenu && matchesCategory && matchesSearch;
    });
  }, [items, selectedMenuFilter, selectedCategoryFilter, searchQuery]);

  return (
    <DashboardLayout pageTitle={t('nav.menuItems', 'Menu Items')}>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--app-border)] gap-4">
          <div>
            <h2 className="text-2xl font-black text-[var(--app-text-primary)]">
              {t('menuItems.title', 'Dishes & Menu Items')}
            </h2>
            <p className="text-xs text-[var(--app-text-secondary)] mt-1">
              {t(
                'menuItems.subtitle',
                'Catalog of individual dishes, appetizers, main courses, and desserts'
              )}
            </p>
          </div>

          {businessId && (
            <Button
              onClick={openCreateModal}
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              disabled={menus.length === 0}
            >
              {t('menuItems.addItem', 'Add Menu Item')}
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

        {/* Check if no menus exist yet */}
        {menus.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="w-6 h-6" />}
            title="Create a Menu First"
            description="Dishes must belong to a catering menu package (e.g. Wedding Feast, Cocktail Buffet). Please create your first menu."
            actionLabel="Go to Menus"
            onAction={() => router.push('/menu')}
          />
        ) : (
          <>
            {/* Search and Filters Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)]">
              <Input
                placeholder="Search dishes by name or course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />

              <select
                className="w-full appearance-none rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3.5 py-2.5 text-sm text-[var(--app-text-primary)]"
                value={selectedMenuFilter}
                onChange={(e) => setSelectedMenuFilter(e.target.value)}
              >
                <option value="ALL">All Menus ({menus.length})</option>
                {menus.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>

              <select
                className="w-full appearance-none rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3.5 py-2.5 text-sm text-[var(--app-text-primary)]"
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Dishes Catalog List */}
            {isLoading ? (
              <div className="py-16 flex justify-center">
                <Spinner size="lg" label="Loading dishes catalog..." />
              </div>
            ) : filteredItems.length === 0 ? (
              <EmptyState
                icon={<UtensilsCrossed className="w-6 h-6" />}
                title="No Dishes Found"
                description={
                  searchQuery || selectedMenuFilter !== 'ALL' || selectedCategoryFilter !== 'ALL'
                    ? 'No dishes match the selected filters. Try adjusting your search query.'
                    : 'Start building your catering catalog by adding your signature recipes and dishes.'
                }
                actionLabel={t('menuItems.addItem', 'Add New Dish')}
                onAction={openCreateModal}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredItems.map((item) => {
                  const assignedMenu = menus.find((m) => m.id === item.menuId);

                  return (
                    <Card
                      key={item.id}
                      className="overflow-hidden flex flex-col justify-between hover:border-[var(--app-primary)]/40 transition-all duration-200"
                    >
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="flex items-center gap-1.5 text-2xs font-bold">
                            {item.isVegetarian ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <Leaf className="w-3 h-3 text-emerald-600" />
                                <span>Pure Veg</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                <Drumstick className="w-3 h-3 text-amber-700" />
                                <span>Non-Veg</span>
                              </span>
                            )}
                          </span>

                          <Badge variant={item.isAvailable ? 'success' : 'neutral'}>
                            {item.isAvailable ? 'Available' : 'Unavailable'}
                          </Badge>
                        </div>

                        <h4 className="text-base font-bold text-[var(--app-text-primary)] mt-1">
                          {item.name}
                        </h4>

                        <p className="text-2xs font-semibold text-[var(--app-text-muted)] uppercase tracking-wider mt-0.5">
                          {item.category}
                        </p>

                        <p className="text-xs text-[var(--app-text-secondary)] line-clamp-2 mt-2">
                          {item.description || 'Authentic gourmet recipe prepared with premium spices.'}
                        </p>

                        <div className="mt-4 pt-3 border-t border-[var(--app-border)] flex items-center justify-between">
                          <div>
                            <span className="text-2xs text-[var(--app-text-muted)] block leading-none">
                              Price / Plate
                            </span>
                            <span className="text-base font-black text-[var(--app-primary)]">
                              {formatCurrency(item.price)}
                            </span>
                          </div>

                          {assignedMenu && (
                            <span className="text-2xs font-semibold text-[var(--app-text-secondary)] bg-[var(--app-surface-2)] px-2 py-1 rounded-md max-w-[120px] truncate">
                              {assignedMenu.name}
                            </span>
                          )}
                        </div>
                      </CardContent>

                      <div className="px-5 py-3 bg-[var(--app-surface-2)]/40 border-t border-[var(--app-border)] flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-[var(--app-text-secondary)] hover:bg-[var(--app-surface)] hover:text-[var(--app-text-primary)] transition-colors cursor-pointer"
                          title="Edit Dish"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Dish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Create / Edit Dish Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? 'Edit Dish Item' : 'Add New Dish Item'}
          description="Catalog recipe details, pricing, and category"
          maxWidth="lg"
        >
          <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4 pt-2">
            <Select
              label={t('menuItems.menu', 'Assign to Menu') + ' *'}
              options={menus.map((m) => ({ value: m.id, label: m.name }))}
              placeholder="Select catering menu"
              error={errors.menuId?.message}
              {...register('menuId')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t('menuItems.name', 'Dish Name') + ' *'}
                placeholder={t('menuItems.namePlaceholder', 'e.g. Paneer Tikka Masala')}
                error={errors.name?.message}
                {...register('name')}
              />

              <Select
                label={t('menuItems.category', 'Course Category') + ' *'}
                options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                error={errors.category?.message}
                {...register('category')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t('menuItems.price', 'Price (₹ per plate / item)') + ' *'}
                type="number"
                min={0}
                error={errors.price?.message}
                {...register('price', { valueAsNumber: true })}
              />

              <Input
                label={t('menuItems.imageUrl', 'Dish Image URL')}
                placeholder="https://images.unsplash.com/..."
                error={errors.image?.message}
                {...register('image')}
              />
            </div>

            <Textarea
              label={t('menuItems.description', 'Dish Description')}
              placeholder="Ingredients, culinary notes, and taste profile..."
              rows={2}
              {...register('description')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-2)]">
                <input
                  type="checkbox"
                  id="isVegCheckbox"
                  className="rounded border-[var(--app-border)] text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  {...register('isVegetarian')}
                />
                <label
                  htmlFor="isVegCheckbox"
                  className="text-xs font-semibold text-[var(--app-text-primary)] cursor-pointer"
                >
                  Pure Vegetarian Dish
                </label>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-2)]">
                <input
                  type="checkbox"
                  id="isAvailableCheckbox"
                  className="rounded border-[var(--app-border)] text-[var(--app-primary)] focus:ring-[var(--app-primary)] w-4 h-4 cursor-pointer"
                  {...register('isAvailable')}
                />
                <label
                  htmlFor="isAvailableCheckbox"
                  className="text-xs font-semibold text-[var(--app-text-primary)] cursor-pointer"
                >
                  Available for Orders Today
                </label>
              </div>
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
                {editingItem ? t('common.save', 'Save Changes') : t('common.create', 'Add Dish')}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
          title="Delete Menu Dish"
          message={`Are you sure you want to delete "${deleteTarget?.name}"? This dish will be removed from your catalog.`}
          confirmLabel={t('common.delete', 'Delete Dish')}
          cancelLabel={t('common.cancel', 'Cancel')}
          isLoading={deleteMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
}
