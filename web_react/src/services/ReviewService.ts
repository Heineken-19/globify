import api from './api';

export const ReviewService = {
  async getReviewsByProduct(productId: number) {
    const response = await api.get(`/api/reviews/${productId}`);
    return response.data;
  },

  async getAverageRating(productId: number) {
    const response = await api.get(`/api/reviews/${productId}/average`);
    return response.data;
  },

  async addReview(userId: number, productId: number, rating: number, comment: string) {
    const response = await api.post(`/api/reviews/${userId}/${productId}`, null, {
      params: { rating, comment },
    });
    return response.data;
  },

  async deleteReview(userId: number, reviewId: number) {
    const response = await api.delete(`/api/reviews/${userId}/${reviewId}`);
    return response.data;
  },
};
