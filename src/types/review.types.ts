export interface ReviewUser {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

export interface Review {
  id: string;
  businessId: string;
  userId: string | ReviewUser;
  rating: number;
  comment?: string;
  status: 'PUBLISHED' | 'FLAGGED' | 'HIDDEN';
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
