import api from "../api";
import { Order } from '../../types';

export const getOrders = async (): Promise<Order[]> => {
  const response = await api.get('/api/admin/orders');
  return response.data;
};

export const updateOrderStatus = async (id: number, status: string): Promise<void> => {
  await api.put(`/api/admin/orders/${id}/status`, { status });
};
