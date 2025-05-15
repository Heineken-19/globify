import api from "../api";
import { Order } from '../../types';

export const getOrders = async (): Promise<Order[]> => {
  const response = await api.get('/api/admin/orders');
  return response.data;
};

export const updateOrderStatus = async (id: number, status: string): Promise<void> => {
  await api.put(`/api/admin/orders/${id}/status`, { status });

  // Ha a státusz "PAID" vagy "CONFIRMED", akkor küldjünk email és számla kérelmeket
  if (status === "PAID" || status === "CONFIRMED") {
    await api.post(`/api/admin/orders/${id}/queue-email`);
    await api.post(`/api/admin/orders/${id}/queue-invoice`);
  }
};



