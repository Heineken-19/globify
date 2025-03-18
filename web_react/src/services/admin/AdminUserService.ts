import  api  from '../../services/api';
import { AdminUser } from '../../types';

export const getUsers = async (): Promise<AdminUser[]> => {
  const response = await api.get('/api/admin/users');
  return response.data;
};

export const updateUserRole = async (userId: number, role: string): Promise<void> => {
  await api.put(`/api/admin/users/${userId}/role`, { role });
};

export const deleteUser = async (userId: number): Promise<void> => {
  await api.delete(`/api/admin/users/${userId}`);
};
