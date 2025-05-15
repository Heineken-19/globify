import api from "./api";
import { OrderRequestDTO, OrderResponseDTO, OrderData, GuestOrderRequestDTO } from "../types";

const OrderService = {
  createOrder: async (orderData: OrderRequestDTO | GuestOrderRequestDTO): Promise<OrderResponseDTO> => {
    const endpoint = 'userId' in orderData ? "/api/orders" : "/api/orders/guest-orders";
    const guestToken = localStorage.getItem("guest_token");
  
    const headers = guestToken && !('userId' in orderData)
      ? { Authorization: `Bearer ${guestToken}` }
      : {};
  
    const response = await api.post<OrderResponseDTO>(endpoint, orderData, { headers });
    return response.data;
  },

  createGuestOrder: async (orderData: any): Promise<any> => {
    const guestToken = localStorage.getItem("guest_token");
    const headers = guestToken
      ? { Authorization: `Bearer ${guestToken}` }
      : {};
  
    const response = await api.post("/api/orders/guest-orders", orderData, { headers });
    return response.data;
  },

  redirectToPayPal: async (orderId: string) => {
    return api.get(`/api/orders/paypal/${orderId}`);
  },

  getUserOrders: async (page: number = 0, size: number = 10) => {
    const response = await api.get<{ content: OrderData[] }>("/api/orders", {
      params: { page, size },
    });
    return response.data.content; // A `content` tartalmazza az oldaltöltött rendeléseket
  },

  /**
   * 🔹 Egy adott rendelés lekérése azonosító alapján
   */
  getOrderById: async (id: number) => {
    const response = await api.get<OrderData>(`/api/orders/${id}`);
    return response.data;
  },

  /**
   * 🔹 Rendelés törlése (csak ha PENDING státuszban van)
   */
  cancelOrder: async (id: number) => {
    const response = await api.put(`/api/orders/${id}/cancel`);
    return response.data;
  },

};

export default OrderService;