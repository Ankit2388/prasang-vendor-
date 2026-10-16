export interface MenuItem {
  id: string;
  menuId: string;
  businessId: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  image?: string;
  isVegetarian: boolean;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Menu {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  category?: string;
  isActive: boolean;
  items?: MenuItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMenuInput {
  name: string;
  description?: string;
  category?: string;
  isActive?: boolean;
  businessId?: string;
}

export type UpdateMenuInput = Partial<CreateMenuInput>;

export interface CreateMenuItemInput {
  menuId: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  image?: string;
  isVegetarian?: boolean;
  isAvailable?: boolean;
  businessId?: string;
}

export type UpdateMenuItemInput = Partial<CreateMenuItemInput>;
