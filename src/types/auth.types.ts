import { Business } from './business.types';

export interface User {
  id: string;
  mobileNumber: string;
  firstName: string;
  lastName: string;
  email?: string;
  role: 'VENDOR' | 'USER' | 'SUPER_ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Vendor {
  id: string;
  userId: string;
  ownerName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  businessName?: string;
  city?: string;
  cuisineTypes?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: User;
  vendor?: Vendor;
  business?: Business;
  tokens: AuthTokens;
}

export interface LoginVendorInput {
  mobileNumber: string;
  password?: string;
  otp?: string;
}

export interface RegisterVendorInput {
  mobileNumber: string;
  firstName: string;
  lastName: string;
  password?: string;
  email?: string;
}
