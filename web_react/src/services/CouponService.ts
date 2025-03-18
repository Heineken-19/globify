import api from './api';


export const CouponService = {
  // Kupon alkalmazása
  applyCoupon: async (code: string, isFirstOrder: boolean) => {
    const response = await api.get(`/api/coupons/apply`, {
      params: { code, isFirstOrder }
    });
    return response.data;
  },

  // Összes kupon lekérdezése
  getAllCoupons: async () => {
    const response = await api.get(`/api/coupons`);
    return response.data;
  },

  // Kupon lekérdezése kód alapján
  getCouponByCode: async (code: string) => {
    const response = await api.get(`/api/coupons/${code}`);
    return response.data;
  },

  // Új kupon létrehozása
  createCoupon: async (coupon: any) => {
    const response = await api.post(`/api/coupons`, coupon);
    return response.data;
  },

  // Kupon törlése
  deleteCoupon: async (id: number) => {
    await api.delete(`/api/coupons/${id}`);
  }
};
