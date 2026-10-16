'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, Vendor, LoginVendorInput, RegisterVendorInput } from '@/types/auth.types';
import { Business } from '@/types/business.types';
import { authService } from '@/services/auth.service';
import { businessService } from '@/services/business.service';

interface AuthContextType {
  user: User | null;
  vendor: Vendor | null;
  business: Business | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: LoginVendorInput) => Promise<void>;
  register: (input: RegisterVendorInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setBusiness: (business: Business | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [business, setBusinessState] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshProfile = useCallback(async () => {
    try {
      const data = await authService.getCurrentUser();
      setUser(data.user);
      if (data.vendor) {
        setVendor(data.vendor);
      }
      if (data.business) {
        setBusinessState(data.business);
      } else {
        // Also check my-business if not populated directly
        const b = await businessService.getMyBusiness();
        setBusinessState(b);
      }
    } catch {
      setUser(null);
      setVendor(null);
      setBusinessState(null);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('prasang_access_token') : null;
      if (token) {
        try {
          await refreshProfile();
        } catch {
          // Token invalid or network issue
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [refreshProfile]);

  const login = async (input: LoginVendorInput) => {
    setIsLoading(true);
    try {
      const result = await authService.loginVendor(input);
      if (typeof window !== 'undefined') {
        localStorage.setItem('prasang_access_token', result.tokens.accessToken);
        localStorage.setItem('prasang_refresh_token', result.tokens.refreshToken);
        localStorage.setItem('prasang_user', JSON.stringify(result.user));
      }
      setUser(result.user);
      setVendor(result.vendor || null);
      setBusinessState(result.business || null);

      if (!result.business) {
        const b = await businessService.getMyBusiness();
        setBusinessState(b);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (input: RegisterVendorInput) => {
    setIsLoading(true);
    try {
      const result = await authService.registerVendor(input);
      if (typeof window !== 'undefined') {
        localStorage.setItem('prasang_access_token', result.tokens.accessToken);
        localStorage.setItem('prasang_refresh_token', result.tokens.refreshToken);
        localStorage.setItem('prasang_user', JSON.stringify(result.user));
      }
      setUser(result.user);
      setVendor(result.vendor || null);
      setBusinessState(result.business || null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setVendor(null);
      setBusinessState(null);
      setIsLoading(false);
      router.push('/login');
    }
  };

  const setBusiness = (b: Business | null) => {
    setBusinessState(b);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        vendor,
        business,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
        setBusiness,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
