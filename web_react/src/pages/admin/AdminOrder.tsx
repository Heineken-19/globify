import { useEffect, useState } from 'react';
import { Select, Table, Button, Container, Paper, Text, Stack, Group } from '@mantine/core';
import { getOrders, updateOrderStatus } from '../../services/admin/AdminOrderService';
import { Order, OrderStatus } from '../../types';
import { useMediaQuery } from '@mantine/hooks';
import AdminBar from "./AdminBar";
import AdminOrderModal from '../../modal/AdminOrderModal';

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loadingStatusId, setLoadingStatusId] = useState<number | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  const handleStatusChange = async (id: number, status: OrderStatus) => {
    setLoadingStatusId(id);
    await updateOrderStatus(id, status);
    await loadOrders();
    setLoadingStatusId(null);
  };

  return (
    <Container size="xl" style={{ paddingTop: "20px", paddingBottom: "20px" }}>
      <AdminBar />

      {isMobile ? (
        <Stack gap="md">
          {orders.map((order) => (
            <Paper key={order.id} shadow="xs" p="md" withBorder>
              <Text size="sm" fw={500}>
                Rendelés #{order.id}
              </Text>
              <Text size="sm">Felhasználó: {order.userEmail}</Text>
              <Text size="sm">
                Végösszeg: {order.finalPrice ? order.finalPrice.toLocaleString() : "N/A"} Ft
              </Text>
              <Group mt="xs">
                <Select
                  value={order.status}
                  onChange={(value) =>
                    value && handleStatusChange(order.id, value as OrderStatus)
                  }
                  data={
                    loadingStatusId === order.id
                      ? [{ value: order.status, label: "Betöltés..." }]
                      : [
                        { value: 'PENDING', label: 'Függőben' },
                        { value: 'PAID', label: 'Fizetve' },
                        { value: 'CONFIRMED', label: 'Összekészítés alatt' },
                        { value: 'SHIPPED', label: 'Átadva futárnak' },
                        { value: 'DELIVERED', label: 'Kiszállítva' },
                        { value: 'CANCELED', label: 'Lemondva' },
                      ]
                  }
                  size="xs"
                  disabled={loadingStatusId === order.id}
                />
                <Button
                  color="red"
                  size="xs"
                  onClick={() => handleStatusChange(order.id, 'CANCELED')}
                >
                  Lemondás
                </Button>
                <Button
                  size="xs"
                  onClick={() => setSelectedOrder(order)}
                  color="green"
                >
                  Részletek
                </Button>
              </Group>
            </Paper>
          ))}
        </Stack>
      ) : (
        <Table highlightOnHover withColumnBorders>
          <thead>
            <tr>
              <th style={{ width: '10%', textAlign: 'center' }}>ID</th>
              <th style={{ width: '20%', textAlign: 'center' }}>Felhasználó</th>
              <th style={{ width: '15%', textAlign: 'center' }}>Végösszeg</th>
              <th style={{ width: '10%', textAlign: 'center' }}>Státusz</th>
              <th style={{ width: '15%', textAlign: 'center' }}>Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={{ textAlign: 'center' }}>{order.id}</td>
                <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>{order.userEmail}</td>
                <td style={{ textAlign: 'center' }}>{order.finalPrice ? order.finalPrice.toLocaleString() : "N/A"}Ft</td>
                <td style={{ textAlign: 'center' }}>
                  <Select
                    value={order.status}
                    onChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                    data={[
                      { value: 'PENDING', label: 'Függőben' },
                      { value: 'PAID', label: 'Fizetve' },
                      { value: 'CONFIRMED', label: 'Összekészítés alatt' },
                      { value: 'SHIPPED', label: 'Átadva futárnak' },
                      { value: 'DELIVERED', label: 'Kiszállítva' },
                      { value: 'CANCELED', label: 'Lemondva' },
                    ]}
                    disabled={loadingStatusId === order.id}
                  />
                </td>
                <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                  <Button onClick={() => handleStatusChange(order.id, 'CANCELED')} color="red">
                    Lemondás
                  </Button>
                  <Button style={{ marginLeft: '5px' }} onClick={() => setSelectedOrder(order)} color="green">
                    Részletek
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {selectedOrder && (
        <AdminOrderModal
          order={selectedOrder}
          opened={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </Container>
  );
};

export default OrdersPage;
