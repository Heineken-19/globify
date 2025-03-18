import api from './api';

export const DiscountService = {
  // Akció alkalmazása
  applyDiscount: async (name: string) => {
    const response = await api.get(`/api/discounts/apply`, {
      params: { name }
    });
    return response.data;
  },

  // Összes kedvezmény lekérdezése
  getAllDiscounts: async () => {
    const response = await api.get(`/api/discounts`);
    return response.data;
  },

  // Akció lekérdezése név alapján
  getDiscountByName: async (name: string) => {
    const response = await api.get(`/api/discounts/${name}`);
    return response.data;
  },

  // Új akció létrehozása
  createDiscount: async (discount: any) => {
    const response = await api.post(`/api/discounts`, discount);
    return response.data;
  },

  // Akció törlése
  deleteDiscount: async (id: number) => {
    await api.delete(`/api/discounts/${id}`);
  }
};
