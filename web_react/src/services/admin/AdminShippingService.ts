import api from '../api';
import { ShippingOption, ShippingOptionInput } from '../../types';

const AdminShippingService = {
  // 🔹 Összes szállítási díj lekérdezése
  getAllShippingOptions: async (): Promise<ShippingOption[]> => {
    const response = await api.get<ShippingOption[]>('/api/admin/shipping');
    return response.data;
  },

  // 🔹 Új szállítási mód létrehozása
  createShippingOption: async (shippingOption: ShippingOptionInput): Promise<ShippingOption> => {
    const response = await api.post<ShippingOption>('/api/admin/shipping', shippingOption);
    return response.data;
  },

  // 🔹 Szállítási mód frissítése
  updateShippingOption: async (id: number, shippingOption: ShippingOptionInput): Promise<ShippingOption> => {
    const response = await api.put<ShippingOption>(`/api/admin/shipping/${id}`, {
      price: shippingOption.price,
    });
    return response.data;
  },

  // 🔹 Szállítási mód törlése
  deleteShippingOption: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/shipping/${id}`);
  },
};

export default AdminShippingService;
