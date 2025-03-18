import { useState, useEffect } from 'react';
import { getUsers, updateUserRole, deleteUser } from '../../services/admin/AdminUserService';
import { AdminUser } from '../../types';

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const changeUserRole = async (id: number, role: string) => {
    await updateUserRole(id, role);
    loadUsers();
  };

  const removeUser = async (id: number) => {
    await deleteUser(id);
    loadUsers();
  };

  return { users, changeUserRole, removeUser };
};
