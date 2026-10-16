import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from './api-error';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// Request Interceptor: Attach Access Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('prasang_access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Handle 401 & Token Refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ success?: boolean; message?: string; errors?: Array<{ field: string; message: string }> }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 Unauthorized and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (typeof window === 'undefined') {
        return Promise.reject(formatApiError(error));
      }

      const refreshToken = localStorage.getItem('prasang_refresh_token');

      // If no refresh token or request was already refresh-token endpoint, logout
      if (!refreshToken || originalRequest.url?.includes('/auth/refresh-token')) {
        handleLogout();
        return Promise.reject(formatApiError(error));
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const newAccessToken = data.data?.accessToken;
        const newRefreshToken = data.data?.refreshToken;

        if (newAccessToken) {
          localStorage.setItem('prasang_access_token', newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem('prasang_refresh_token', newRefreshToken);
          }

          apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          processQueue(null, newAccessToken);
          return apiClient(originalRequest);
        } else {
          handleLogout();
          return Promise.reject(formatApiError(error));
        }
      } catch (refreshErr) {
        processQueue(refreshErr as Error, null);
        handleLogout();
        return Promise.reject(formatApiError(refreshErr as AxiosError));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(formatApiError(error));
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatApiError(error: AxiosError<any> | any): ApiError {
  const statusCode = error?.response?.status || 500;
  const data = error?.response?.data;
  const message = data?.message || error?.message || 'An unexpected server error occurred';
  const errors = data?.errors;
  return new ApiError(message, statusCode, errors);
}

function handleLogout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('prasang_access_token');
    localStorage.removeItem('prasang_refresh_token');
    localStorage.removeItem('prasang_user');
    if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = '/login';
    }
  }
}
