import { useEffect, useState } from 'react';
import { Select, Table, Button, Container } from '@mantine/core';
import { getOrders, updateOrderStatus } from '../../services/admin/AdminOrderService';
import { Order, OrderStatus } from '../../types';
import AdminBar from "./AdminBar";
import AdminOrderModal from '../../modal/AdminOrderModal';

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  const handleStatusChange = async (id: number, status: OrderStatus) => {
    await updateOrderStatus(id, status);
    loadOrders();
  };

  return (
        <Container size="xl" style={{ paddingTop: "20px", paddingBottom: "20px" }}>
          <AdminBar />
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
              <td style={{ textAlign: 'center' }}>{order.total.toLocaleString()} Ft</td>
              <td style={{ textAlign: 'center' }}>
              <Select
                value={order.status}
                onChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                data={['PENDING', 'PAID', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELED']}
              />
            </td>
            <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
              <Button onClick={() => handleStatusChange(order.id, 'CANCELED')} color="red">
                Lemondás
              </Button>
              <Button style={{ marginLeft: '5px' }}onClick={() => setSelectedOrder(order)} color="green">
                Részletek
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>

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
