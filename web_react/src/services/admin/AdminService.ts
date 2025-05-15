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

  async getWeeklyRevenueLast5() {
    const response = await api.get("/api/admin/stats/weekly-revenue-last-5");
    return response.data;
  },

  async getTopProducts(limit: number = 5) {
    const response = await api.get(`/api/admin/stats/top-products`, {
      params: { limit },
    });
    return response.data;
  },

  async getMonthlyRevenueLast5() {
    const response = await api.get("/api/admin/stats/monthly-revenue-last-5");
    return response.data;
  },
  
};




export default AdminService;
