import { apiClient } from './api-client';
import { ApiResponse } from '@/types/api.types';
import { VendorDashboardData } from '@/types/vendor.types';

export const vendorService = {
  async getDashboard(): Promise<VendorDashboardData> {
    const response = await apiClient.get<ApiResponse<VendorDashboardData>>('/vendors/dashboard');
    return response.data.data;
  },

  async getVendorProfile(vendorId: string) {
    const response = await apiClient.get<ApiResponse<unknown>>(`/vendors/public/${vendorId}`);
    return response.data.data;
  },
};
