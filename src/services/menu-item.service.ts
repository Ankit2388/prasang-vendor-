import { apiClient } from './api-client';
import { ApiResponse } from '@/types/api.types';
import { MenuItem, CreateMenuItemInput, UpdateMenuItemInput } from '@/types/menu.types';

export const menuItemService = {
  async getItemsByBusinessId(businessId: string): Promise<MenuItem[]> {
    const response = await apiClient.get<ApiResponse<MenuItem[]>>(
      `/menu-items/business/${businessId}`
    );
    return response.data.data || [];
  },

  async getItemsByMenuId(menuId: string): Promise<MenuItem[]> {
    const response = await apiClient.get<ApiResponse<MenuItem[]>>(
      `/menu-items/menu/${menuId}`
    );
    return response.data.data || [];
  },

  async getMenuItemById(id: string): Promise<MenuItem> {
    const response = await apiClient.get<ApiResponse<MenuItem>>(`/menu-items/${id}`);
    return response.data.data;
  },

  async createMenuItem(input: CreateMenuItemInput): Promise<MenuItem> {
    const response = await apiClient.post<ApiResponse<MenuItem>>('/menu-items', input);
    return response.data.data;
  },

  async updateMenuItem(id: string, input: UpdateMenuItemInput): Promise<MenuItem> {
    const response = await apiClient.put<ApiResponse<MenuItem>>(`/menu-items/${id}`, input);
    return response.data.data;
  },

  async deleteMenuItem(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/menu-items/${id}`);
  },
};
