import { User, Vendor } from './auth.types';

export interface VendorDashboardStats {
  totalQuotations: number;
  pendingEstimations: number;
  confirmedBookings: number;
  rating: number;
}

export interface VendorDashboardData {
  user: User;
  vendor: Vendor;
  dashboardStats: VendorDashboardStats;
}
