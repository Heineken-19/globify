import { modals } from '@mantine/modals';
import { useEffect, useState } from "react";
import { Container, Card, Text, Group, Badge, Button, Loader, Alert, Divider } from "@mantine/core";
import { IconTruckDelivery, IconShoppingCart, IconTrash } from "@tabler/icons-react";
import { translateOrderStatus, translateOrderPayment, translateOrderShipping } from '../utils/translate';
import UserBar from "../components/UserBar";
import useOrder from "../hooks/useOrder";
import dayjs from "dayjs";
import OrderModal from "../modal/OrderModal";
import { useNotification } from "../context/NotificationContext";
import { formatPrice } from "../utils/formatPrice";

export default function OrderPage() {
  const { fetchUserOrders, orders, loading, error, cancelOrder } = useOrder();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const handleCancelOrder = (orderId: number) => {
    modals.openConfirmModal({
      title: 'Rendelés lemondása',
      centered: true,
      children: (
        <Text size="sm">
          Biztosan le szeretnéd mondani a rendelést?
        </Text>
      ),
      labels: { confirm: 'Igen', cancel: 'Mégse' },
      confirmProps: { color: 'red' },
      cancelProps: { color: 'gray' },
      onConfirm: async () => {
        try {
          await cancelOrder(orderId);
          showSuccess('A rendelést sikeresen lemondtad.');
        } catch (err) {
          showError('Nem sikerült lemondani a rendelést.');
        }
      },
    });
  };

  if (loading) return <Loader />;
  if (error) return <Alert color="red">{error}</Alert>;


  // Aktív rendelések felül, lezárt rendelések alul
  const sortedOrders = [...orders].sort((a, b) => {
    if (a.status !== "COMPLETE" && b.status === "COMPLETE") return -1;
    if (a.status === "COMPLETE" && b.status !== "COMPLETE") return 1;
    return dayjs(b.createdAt).diff(dayjs(a.createdAt));
  });

  const handleOpenModal = (orderId: any) => {
    setSelectedOrder(orderId);
    setModalOpened(true);
  };

  return (
    <Container size="md" py="xl">
      <UserBar />

      <Text size="xl" fw={700} mb="md">Rendeléseid</Text>

      {sortedOrders.length === 0 ? (
        <Text color="gray" mt="md">Nincsenek rendelések.</Text>
      ) : (
        sortedOrders.map((order) => (
          <Card key={order.id} shadow="sm" padding="lg" radius="md" withBorder mb="md" >
            <Group justify="center" mt="md">
              <Text fw={500}>Rendelési szám: #{order.id}</Text>
              <Badge
                style={{ alignItems: "center" }}
                color={
                  order.status === "DELIVERED" || order.status === "PAID"
                    ? "green"
                    : order.status === "PENDING"
                      ? "yellow"
                      : order.status === "CONFIRMED" || order.status === "SHIPPED"
                        ? "blue"
                        : order.status === "CANCELED"
                          ? "red"
                          : "gray"
                }
              >
                {translateOrderStatus(order.status ?? "")}
              </Badge>
            </Group>

            <Text size="sm" color="dimmed">{dayjs(order.createdAt).format("YYYY. MM. DD. HH:mm")}</Text>

            {order.items?.length ? (
              <Group justify="left" mt="md" gap="md">
                <IconShoppingCart size={20} />
                <Text size="sm">{order.items.length} termék rendelve</Text>
              </Group>
            ) : (
              <Text size="sm" color="gray">Nincsenek rendelt termékek</Text>
            )}

            <Group justify="left" mt="md" gap="md">
              <IconTruckDelivery size={20} />
              <Text>{translateOrderShipping(order.shippingPoint || order.shippingAddress || "Nincs megadva")}</Text>
            </Group>

            <Group justify="left" mt="md" gap="md">
              <Text>{translateOrderPayment(order.paymentMethod || "Nincs megadva")}</Text>
            </Group>

            {(order.finalPrice ?? 0) - (order.totalPrice ?? 0) < 0 && (
              <Group justify="left" mt="md" gap="xs">
                <div>
                  <Text fw={400} size="sm" mt="md">
                    Termékek ára: <b>
                      {formatPrice(order.totalPrice ?? 0)}
                    </b>
                  </Text>

                  <Text fw={400} color="orange" size="sm" mt="md">
                    Kedvezmény: <b>
                      {formatPrice(-Math.abs(order.discountAmount ?? 0))}
                    </b>
                  </Text>
                  {(order.usedRewardPoints ?? 0) > 0 && (
                    <Text fw={400} color="blue" size="sm" mt="md">
                      Felhasznált pont: <b>{formatPrice(-order.usedRewardPoints!)}</b>
                    </Text>
                  )}
                  <Divider my="sm" />

                </div>
              </Group>
            )}
            <Group justify="left" >
              <div>
                <Text fw={400} color="black" size="sm" mt="md">
                  Szállítási díj: <b>
                    {formatPrice(order.shippingCost ?? 0)}
                  </b>
                </Text>
                <Divider my="sm" />
              </div>
            </Group>

            <Group justify="left" mt="xs" gap="xs">
              <Text fw={700} size="l" mt="sm" >   Fizetendő : <b>
                {formatPrice(order.finalPrice ?? 0)}
              </b></Text>
            </Group>

            <Group justify="center" mt="md">
              {order.status === "PENDING" || order.status === "PAID" ? (
                <Button leftSection={<IconTrash size={14} />} color="red" size="xs" onClick={() => handleCancelOrder(order.id)}>
                  Rendelés lemondása
                </Button>
              ) : null}
              <Button
                variant="outline"
                size="xs"
                onClick={() => handleOpenModal(order.id)}
              >
                Részletek
              </Button>
            </Group>
          </Card>
        ))
      )}

      {/* Modal megjelenítése */}
      <OrderModal
        orderId={selectedOrder}
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
      />
    </Container>
  );
}
