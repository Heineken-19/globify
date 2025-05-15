import { Select, Table, Button, Container, Paper, Text, Stack, Group, } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useAdminUsers } from '../../hooks/admin/useAdminUsers';
import AdminBar from './AdminBar';

const roles = ['USER', 'ADMIN'];

const AdminUser = () => {
  const { users, changeUserRole, removeUser } = useAdminUsers();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Container size="xl" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
      <AdminBar />

      {isMobile ? (
        <Stack gap="md">
          {users.map((user) => (
            <Paper key={user.id} shadow="xs" p="md" withBorder>
              <Text size="sm" fw={500}>
                {user.firstName} {user.lastName}
              </Text>
              <Text size="sm">{user.email}</Text>
              <Text size="sm">Tel.: {user.phone || 'N/A'}</Text>
              <Text size="sm">Regisztráció: {new Date(user.createdAt).toLocaleString()}</Text>
              <Text size="sm">Utolsó belépés: {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}</Text>
              <Group mt="xs">
                <Select
                  value={user.role}
                  onChange={(value) => value && changeUserRole(user.id, value)}
                  data={roles}
                  size="xs"
                />
                <Button
                  color="red"
                  size="xs"
                  onClick={() => removeUser(user.id)}
                >
                  Törlés
                </Button>
              </Group>
            </Paper>
          ))}
        </Stack>
      ) : (
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
      )}
    </Container>
  );
};

export default AdminUser;
