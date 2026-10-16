export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    isAnonymous?: boolean;
    user?: {
      firstName: string;
      lastName: string;
      role: string;
    } | null;
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
