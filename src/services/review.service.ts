import { apiClient } from './api-client';
import { ApiResponse } from '@/types/api.types';
import { ReviewsResponse, Review } from '@/types/review.types';

export const reviewService = {
  async getReviewsByBusinessId(
    businessId: string,
    params?: { page?: number; limit?: number; status?: string }
  ): Promise<ReviewsResponse> {
    const response = await apiClient.get<ApiResponse<ReviewsResponse>>(
      `/reviews/business/${businessId}`,
      { params }
    );
    return (
      response.data.data || {
        reviews: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
      }
    );
  },

  async getReviewById(id: string): Promise<Review> {
    const response = await apiClient.get<ApiResponse<Review>>(`/reviews/${id}`);
    return response.data.data;
  },
};
