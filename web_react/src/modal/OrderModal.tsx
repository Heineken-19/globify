import { useEffect, useState } from "react";
import { Modal, Avatar, Text, Button, Group, Table, Loader, Alert, Card, Stack, Badge } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import useOrder from "../hooks/useOrder";
import { OrderModalProps } from "../types";
import { API_URL } from '../config/config';
import { useMediaQuery } from "@mantine/hooks";
import { useModal } from "../context/ModalContext";


export default function OrderModal({ orderId, opened, onClose }: OrderModalProps) {
  const navigate = useNavigate();
  const { getOrderById } = useOrder();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { setModalOpen } = useModal();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    setModalOpen(opened); // amikor nyitva van, állítsd be
  }, [opened]);
  
  useEffect(() => {
    if (orderId && opened) {
      setLoading(true);
      getOrderById(orderId)
        .then((data) => {
          if (data) {
            setOrder(data);
          } else {
            setError("Nem sikerült lekérni a rendelés adatait.");
          }
        })
        .catch(() => setError("Hiba történt a rendelés lekérése közben."))
        .finally(() => setLoading(false));
    }
  }, [orderId, opened]);

  // 🔥 Ellenőrizzük, hogy az order már létezik
  if (!order) return null;

  if (loading) return <Loader />;
  if (error) return <Alert color="red">{error}</Alert>;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size={isMobile ? "90%" : "1200"}
      withCloseButton
      styles={{
        content: {
          position: isMobile ? 'fixed' : 'absolute',
          bottom: isMobile ? '10px' : '50px',
        },
        body: {
          maxWidth: isMobile ? "45vh" : "auto",
          maxHeight: isMobile ? "80vh" : "auto",
          overflowY: isMobile ? "auto" : "visible",
          paddingRight: isMobile ? 20 : undefined,
        },
      }}
    >
      <Text size="xl" fw={700} mb="md">
        Rendelés részletei #{order?.id}
      </Text>

      {isMobile ? (
        // 📱 Mobil nézet - kártyás
        <Stack>
          {order?.items?.map((item: any) => {
            const imageUrl =
              item.product.imageUrls && item.product.imageUrls.length > 0
                ? `${API_URL}/uploads/products/${item.product.imageUrls[0]}`
                : `${API_URL}/uploads/products/default.jpg`;

            return (
              <Card key={item.id} shadow="sm" padding="md" radius="md" withBorder>
                <Group align="flex-start">
                  <Avatar src={imageUrl} size={60} radius="md" />
                  <Stack gap={4}>
                    <Text fw={700}>{item.product.name}</Text>
                    <Text size="sm">Méret: {item.size || "N/A"} cm</Text>
                    <Text size="sm">
                      Típus:{" "}
                      {item.type
                        ? item.type.split(",").map((part: string, index: number) => (
                          <div key={index}>{part.trim()}</div>
                        ))
                        : "N/A"}
                    </Text>

                    <Text size="sm">Mennyiség: {item.quantity} db</Text>
                    <Text size="sm" fw={700}>
                      {new Intl.NumberFormat("hu-HU", {
                        useGrouping: true,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })
                        .format(item.price ?? 0)
                        .replace(/\s/g, ".")} Ft
                    </Text>
                    <Button
                      size="xs"
                      color="blue"
                      onClick={() => navigate(`/product`)}
                      mt="xs"
                    >
                      Termék megtekintése
                    </Button>
                  </Stack>
                </Group>
              </Card>
            );
          })}
        </Stack>
      ) : (
        <Table striped
          highlightOnHover
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={{ width: "10%" }}></th>
              <th style={{ width: "15%" }}></th>
              <th style={{ width: "20%" }}></th>
              <th style={{ width: "15%" }}></th>
              <th style={{ width: "5%" }}></th>
              <th style={{ width: "10%" }}></th>
              <th style={{ width: "15%" }}></th>
            </tr>
          </thead>
          <tbody>
            {order?.items?.map((item: any) => {
              const imageUrl =
                item.product.imageUrls && item.product.imageUrls.length > 0
                  ? `${API_URL}/uploads/products/${item.product.imageUrls[0]}`
                  : `${API_URL}/uploads/products/default.jpg`;

              return (
                <tr key={item.id}>
                  <td>
                    <Avatar src={imageUrl} style={{ width: 50, height: 50 }} />
                  </td>
                  <td>{item.product.name}</td>
                  <td>Termék mérete: {item.size || "N/A"} cm</td>
                  <td>
                    {item.type
                      ? (item.type.split(",") as string[]).map((part: string, index: number) => (
                        <span key={index}>
                          {part.trim()}
                          {index < item.type.split(",").length - 1 && <br />} {/* Sortörés */}
                        </span>
                      ))
                      : "N/A"}
                  </td>
                  <td>{item.quantity} db</td>
                  <td>
                    {new Intl.NumberFormat("hu-HU", {
                      useGrouping: true,
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })
                      .format(item.price ?? 0)
                      .replace(/\s/g, ".")} Ft
                  </td>
                  <td>
                    <Button
                      size="xs"
                      color="blue"
                      onClick={() => navigate(`/product`)}
                    >
                      Termék megtekintése
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      {/* Összegzés */}
      <Group justify="space-between" mt="md">
        <Text size="lg" fw={700}>
          Végösszeg:{" "}
          <b>
            {new Intl.NumberFormat("hu-HU", {
              useGrouping: true,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })
              .format(order?.finalPrice ?? 0)
              .replace(/\s/g, ".")} Ft
          </b>
        </Text>
      </Group>
    </Modal>
  );
}
