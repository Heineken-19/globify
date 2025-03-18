import api from './api';

export const ShippingService = {
  async getShippingCost(method: string, totalAmount: number) {
    const response = await api.get(`/api/shipping/${method}`, {
      params: { totalAmount },
    });
    return response.data;
  },
};
