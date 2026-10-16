import { apiClient } from './api-client';
import { ApiResponse } from '@/types/api.types';
import { Menu, CreateMenuInput, UpdateMenuInput } from '@/types/menu.types';

export const menuService = {
  async getMenusByBusinessId(businessId: string): Promise<Menu[]> {
    const response = await apiClient.get<ApiResponse<Menu[]>>(`/menus/business/${businessId}`);
    return response.data.data || [];
  },

  async getMenuById(id: string): Promise<Menu> {
    const response = await apiClient.get<ApiResponse<Menu>>(`/menus/${id}`);
    return response.data.data;
  },

  async createMenu(input: CreateMenuInput): Promise<Menu> {
    const response = await apiClient.post<ApiResponse<Menu>>('/menus', input);
    return response.data.data;
  },

  async updateMenu(id: string, input: UpdateMenuInput): Promise<Menu> {
    const response = await apiClient.put<ApiResponse<Menu>>(`/menus/${id}`, input);
    return response.data.data;
  },

  async deleteMenu(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/menus/${id}`);
  },
};
