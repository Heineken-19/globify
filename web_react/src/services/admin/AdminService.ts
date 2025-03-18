import api from "../api";



const AdminService = {
  async getRegistrationsStats(startDate: string, endDate: string) {
    const response = await api.get(`/api/admin/stats/registrations`, {
      params: { startDate, endDate },
    });
    return response.data;
  },

  async getDailyOrderStats(date: string) {
    const response = await api.get(`/api/admin/stats/orders/stats`, {
      params: { date },
    });
    return response.data;
  },

  async getUserActivity() {
    const response = await api.get(`/api/admin/stats/user-activity`);
    return response.data;
  },

  async getLoginsCount(date: string) {
    try {
      const response = await api.get(`/api/admin/stats/logins`, {
        params: { date },
      });

      // 🔹 Ellenőrizzük, hogy az API megfelelő szerkezetben küldi-e vissza az adatokat
      return {
        date,
        logins: response.data.logins || response.data.totalLogins || 0,
      };
    } catch (error) {
      console.error("Hiba történt a bejelentkezések lekérésekor:", error);
      throw error;
    }
  },

  async getRevenueStats(period: "weekly" | "monthly") {
    const response = await api.get(`/api/admin/stats/revenue`, {
      params: { period },
    });
    return response.data;
  },

  async getTopProducts(limit: number = 5) {
    const response = await api.get(`/api/admin/stats/top-products`, {
      params: { limit },
    });
    return response.data;
  },
};

export default AdminService;
