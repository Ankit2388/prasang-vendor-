import { apiClient } from './api-client';
import { ApiResponse } from '@/types/api.types';
import { Business, CreateBusinessInput, UpdateBusinessInput } from '@/types/business.types';

export const businessService = {
  async getMyBusiness(): Promise<Business | null> {
    try {
      const response = await apiClient.get<ApiResponse<Business>>('/businesses/my-business');
      return response.data.data;
    } catch (error: unknown) {
      // If 404, the vendor hasn't created a business yet
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any)?.statusCode === 404 || (error as any)?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async createBusiness(input: CreateBusinessInput): Promise<Business> {
    const response = await apiClient.post<ApiResponse<Business>>('/businesses', input);
    return response.data.data;
  },

  async updateBusiness(id: string, input: UpdateBusinessInput): Promise<Business> {
    const response = await apiClient.put<ApiResponse<Business>>(`/businesses/${id}`, input);
    return response.data.data;
  },

  async getBusinessById(id: string): Promise<Business> {
    const response = await apiClient.get<ApiResponse<Business>>(`/businesses/${id}`);
    return response.data.data;
  },
};
