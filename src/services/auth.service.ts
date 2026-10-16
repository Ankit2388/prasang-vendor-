import { apiClient } from './api-client';
import { ApiResponse } from '@/types/api.types';
import { AuthResult, LoginVendorInput, RegisterVendorInput, User, Vendor } from '@/types/auth.types';
import { Business } from '@/types/business.types';

export const authService = {
  async loginVendor(input: LoginVendorInput): Promise<AuthResult> {
    const response = await apiClient.post<ApiResponse<AuthResult>>('/auth/login/vendor', input);
    return response.data.data;
  },

  async registerVendor(input: RegisterVendorInput): Promise<AuthResult> {
    const response = await apiClient.post<ApiResponse<AuthResult>>('/auth/register/vendor', input);
    return response.data.data;
  },

  async getCurrentUser(): Promise<{ user: User; vendor?: Vendor; business?: Business }> {
    const response = await apiClient.get<ApiResponse<{ user: User; vendor?: Vendor; business?: Business }>>(
      '/auth/me'
    );
    return response.data.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network failure on logout
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('prasang_access_token');
        localStorage.removeItem('prasang_refresh_token');
        localStorage.removeItem('prasang_user');
      }
    }
  },

  async sendOtp(mobileNumber: string, purpose = 'LOGIN') {
    const response = await apiClient.post<ApiResponse<{ otp?: string; message: string }>>('/auth/send-otp', {
      mobileNumber,
      purpose,
    });
    return response.data.data;
  },

  async verifyOtp(mobileNumber: string, otp: string, purpose = 'LOGIN') {
    const response = await apiClient.post<ApiResponse<{ verified: boolean; message: string }>>('/auth/verify-otp', {
      mobileNumber,
      otp,
      purpose,
    });
    return response.data.data;
  },
};
