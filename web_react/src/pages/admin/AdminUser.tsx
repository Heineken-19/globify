import { Select, Table, Button, Container } from '@mantine/core';
import { useAdminUsers } from '../../hooks/admin/useAdminUsers';
import AdminBar from './AdminBar';

const roles = ['USER', 'ADMIN'];

const AdminUser = () => {
  const { users, changeUserRole, removeUser } = useAdminUsers();

  return (
    <Container size="xl" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
      <AdminBar />
      <Table>
        <thead>
          <tr>
          <th style={{ width: '5%' }}>ID</th>
      <th style={{ width: '15%' }}>Email</th>
      <th style={{ width: '8%' }}>Vezetéknév</th>
      <th style={{ width: '8%' }}>Keresztnév</th>
      <th style={{ width: '14%' }}>Telefonszám</th>
      <th style={{ width: '15%' }}>Regisztráció dátuma</th>
      <th style={{ width: '15%' }}>Utolsó bejelentkezés</th>
      <th style={{ width: '10%' }}>Jogosultság</th>
      <th style={{ width: '10%' }}>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ textAlign: 'center' }}>{user.id}</td>
              <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>{user.email}</td>
              <td style={{ textAlign: 'center' }}>{user.firstName}</td>
              <td style={{ textAlign: 'center' }}>{user.lastName}</td>
              <td style={{ textAlign: 'center' }}>{user.phone || 'N/A'}</td>
              <td style={{ textAlign: 'center' }}>{new Date(user.createdAt).toLocaleString()}</td>
              <td style={{ textAlign: 'center' }}>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}</td>
              <td>
                <Select
                  value={user.role}
                  onChange={(value) => value && changeUserRole(user.id, value)}
                  data={roles}
                />
              </td>
              <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                <Button
                  color="red"
                  onClick={() => removeUser(user.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminUser;
